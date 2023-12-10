import proxy from 'http-proxy-middleware';
import express from 'express';
import {MediaDocRecord} from '../shared/mdoc-commons/model/records/mdoc-record';
import {BackendConfigType} from './backend.commons';

export enum PictureResolutions {
    'x100' = 'x100', 'x300' = 'x300', 'x600' = 'x600'
}

export class AssetsServerModule {
    public static configureStaticPictureRoutes(app: express.Application, apiPrefix: string, backendConfig: BackendConfigType) {
        if (backendConfig.apiRoutePictures && backendConfig.apiRoutePicturesStaticDir) {
            if (backendConfig.apiRoutePicturesStaticEnabled !== true) {
                console.warn('SKIP route pictures NOT Enabled:',
                    apiPrefix + backendConfig.apiRoutePictures + ' to ' + backendConfig.apiRoutePicturesStaticDir);
                return;
            }

            const options = {
                dotfiles: 'ignore',
                etag: false,
                index: false,
                maxAge: '30d',
                redirect: false
            };

            console.log('configure route picturestatic:',
                apiPrefix + backendConfig.apiRoutePictures + ' to ' + backendConfig.apiRoutePicturesStaticDir);
            app.use(apiPrefix + backendConfig.apiRoutePictures, express.static(backendConfig.apiRoutePicturesStaticDir, options));
        } else if (backendConfig.apiRoutePictures && backendConfig.proxyPicturesRouteToUrl) {
            console.log('configure route pictureproxy:',
                apiPrefix +  backendConfig.apiRoutePictures + ' to ' + backendConfig.proxyPicturesRouteToUrl);
            app.use(apiPrefix + backendConfig.apiRoutePictures,
                proxy.createProxyMiddleware({target: backendConfig.proxyPicturesRouteToUrl, changeOrigin: true}));
        }
    }

    public static configureStoredPictureRoutes(app: express.Application, apiPrefix: string, backendConfig: BackendConfigType,
                                               errorFile: string, filePathErrorDocs: string) {
        if (backendConfig.apiRouteStoredPictures && backendConfig.apiRoutePicturesStaticDir) {
            console.log('configure route picturestore:',
                apiPrefix + backendConfig.apiRouteStoredPictures + ':resolution/:resolveMdocByMdocId'
                + ' to ' + backendConfig.apiRoutePicturesStaticDir);
            app.param('resolution', function(req, res, next, resolution) {
                req['resolution'] = undefined;
                if (Object.keys(PictureResolutions).indexOf(resolution) < 0) {
                    return next('not found');
                }
                req['resolution'] = resolution;
                return next();
            });
            // use id: param to read from solr
            app.route(apiPrefix + backendConfig.apiRouteStoredPictures + ':resolution/:resolveMdocByMdocId')
                .all(function(req, res, next) {
                    if (req.method !== 'GET') {
                        return next('not allowed');
                    }
                    return next();
                })
                .get(function(req, res, next) {
                    const mdoc: MediaDocRecord = req['mdoc'];
                    const resolution = req['resolution'];
                    if (resolution === undefined || mdoc === undefined
                        || !Array.isArray(mdoc['mdocimages']) || mdoc['mdocimages'].length < 1) {
                        res.status(200);
                        res.sendFile(errorFile, {root: filePathErrorDocs});
                        return;
                    }
                    res.status(200);
                    res.sendFile((backendConfig.apiRouteStoredPicturesResolutionPrefix || '')
                        + resolution + '/' + mdoc['mdocimages'][0]['fileName'],
                        {root: backendConfig.apiRoutePicturesStaticDir});
                    return;
                });
        }
    }
}
