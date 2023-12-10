import proxy from 'http-proxy-middleware';
import express from 'express';
import {isArray} from 'util';
import {MediaDocRecord} from '../shared/mdoc-commons/model/records/mdoc-record';
import {BackendConfigType} from './backend.commons';

export enum AudioResolutions {
    'cover' = 'cover', 'mp3' = 'mp3', 'thumbnail' = 'thumbnail'
}

export class AudioServerModule {
    public static configureStaticAudioRoutes(app: express.Application, apiPrefix: string, backendConfig: BackendConfigType) {
        if (backendConfig.apiRouteAudios && backendConfig.apiRouteAudiosStaticDir) {
            if (backendConfig.apiRouteAudiosStaticEnabled !== true) {
                console.warn('SKIP route audios NOT Enabled:',
                    apiPrefix + backendConfig.apiRouteAudios + ' to ' + backendConfig.apiRouteAudiosStaticDir);
                return;
            }

            const options = {
                dotfiles: 'ignore',
                etag: false,
                index: false,
                maxAge: '30d',
                redirect: false
            };

            console.log('configure route audiostatic:',
                apiPrefix + backendConfig.apiRouteAudios + ' to ' + backendConfig.apiRouteAudiosStaticDir);
            app.use(apiPrefix + backendConfig.apiRouteAudios, express.static(backendConfig.apiRouteAudiosStaticDir, options));
        } else if (backendConfig.apiRouteAudios && backendConfig.proxyAudiosRouteToUrl) {
            console.log('configure route audioproxy:',
                apiPrefix +  backendConfig.apiRouteAudios + ' to ' + backendConfig.proxyAudiosRouteToUrl);
            app.use(apiPrefix + backendConfig.apiRouteAudios,
                proxy.createProxyMiddleware({target: backendConfig.proxyAudiosRouteToUrl, changeOrigin: true}));
        }
    }

    public static configureStoredAudioRoutes(app: express.Application, apiPrefix: string, backendConfig: BackendConfigType,
                                               errorFile: string, filePathErrorDocs: string) {
        if (backendConfig.apiRouteStoredAudios && backendConfig.apiRouteAudiosStaticDir) {
            console.log('configure route audiostore:',
                apiPrefix + backendConfig.apiRouteStoredAudios + ':audioresolution/:resolveMdocByMdocId'
                + ' to ' + backendConfig.apiRouteAudiosStaticDir);
            app.param('audioresolution', function(req, res, next, resolution) {
                req['audioresolution'] = undefined;
                if (Object.keys(AudioResolutions).indexOf(resolution) < 0) {
                    return next('not found');
                }
                req['audioresolution'] = resolution;
                return next();
            });
            app.route(apiPrefix + backendConfig.apiRouteStoredAudios + ':audioresolution/:resolveMdocByMdocId')
                .all(function(req, res, next) {
                    if (req.method !== 'GET') {
                        return next('not allowed');
                    }
                    return next();
                })
                .get(function(req, res, next) {
                    const mdoc: MediaDocRecord = req['mdoc'];
                    const resolution = req['audioresolution'];
                    if (resolution === undefined || mdoc === undefined) {
                        res.status(200);
                        res.sendFile(errorFile, {root: filePathErrorDocs});
                        return;
                    }
                    if (resolution === AudioResolutions.cover) {
                        if (!isArray(mdoc['mdocimages']) || mdoc['mdocimages'].length < 0) {
                            res.status(200);
                            res.sendFile(errorFile, {root: filePathErrorDocs});
                            return;
                        }

                        res.status(200);
                        res.sendFile((backendConfig.apiRouteStoredAudiosResolutionPrefix || '')
                            + mdoc['mdocimages'][0]['fileName'],
                            {root: backendConfig.apiRouteAudiosStaticDir});
                        return;
                    }

                    if (!isArray(mdoc['mdocaudios']) || mdoc['mdocaudios'].length < 0) {
                        res.status(200);
                        res.sendFile(errorFile, {root: filePathErrorDocs});
                        return;
                    }
                    res.status(200);
                    res.sendFile((backendConfig.apiRouteStoredAudiosResolutionPrefix || '')
                        + mdoc['mdocaudios'][0]['fileName'],
                        {root: backendConfig.apiRouteAudiosStaticDir});
                    return;
                });
        }
    }
}
