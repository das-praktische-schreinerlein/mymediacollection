/* tslint:disable:no-unused-variable */
import {MediaDocRecord} from '../model/records/mdoc-record';
import {MediaDocDataService} from './mdoc-data.service';
import {MediaDocDataStore, MediaDocTeamFilterConfig} from './mdoc-data.store';
import {SearchParameterUtils} from '@dps/mycms-commons/dist/search-commons/services/searchparameter.utils';
import {forkJoin, from} from 'rxjs';

describe('MediaDocDataService', () => {
    let mdoc1: MediaDocRecord = undefined;
    let mdoc2: MediaDocRecord = undefined;
    let service: MediaDocDataService;

    beforeEach(() => {
        const datastore = new MediaDocDataStore(new SearchParameterUtils(), new MediaDocTeamFilterConfig());
        service = new MediaDocDataService(datastore);
        service.setWritable(true);
        mdoc1 = new MediaDocRecord({desc: '', name: 'Testmdoc1', persons: '', id: '1', type: 'image', subtype: '5'});
        mdoc2 = new MediaDocRecord({desc: '', name: 'Testmdoc2', persons: '', id: '2', type: 'image', subtype: '5'});
    });

    it('should ...', done => {
        // WHEN/THEN
        expect(service).toBeTruthy();
        done();
    });

    describe('#getAll()', () => {
        it('should return an empty array by default', done => {
            // WHEN
            from(service.getAll()).subscribe(
                mdocs => {
                    // THEN
                    expect(mdocs).toEqual([]);
                    done();
                },
                error => {
                    expect(error).toBeUndefined();
                    done();
                },
                () => {
                    done();
                }
            );
        });

        it('should return all mdocs', done => {
            // GIVEN
            forkJoin(
                service.addMany([mdoc1, mdoc2]),
                service.getAll()
            ).subscribe(
                results => {
                    // THEN: add MediaDocs
                    expect(results[0].toString()).toEqual([mdoc1, mdoc2].toString());
                    // THEN: get MediaDocs
                    expect(results[1].toString()).toEqual([mdoc1, mdoc2].toString());
                    done();
                },
                error => {
                    expect(error).toBeUndefined();
                    done();
                },
                () => {
                    done();
                }
            );
        });
    });
    describe('#save(record)', () => {

        it('should automatically assign an incrementing id', done => {
            // GIVEN
            forkJoin(
                service.addMany([mdoc1, mdoc2]),
                service.getById('1'),
                service.getById('2')
            ).subscribe(
                results => {
                    // THEN: add MediaDocs
                    expect(results[0].toString()).toEqual([mdoc1, mdoc2].toString());
                    // THEN: get MediaDocs
                    expect(results[1].toString()).toEqual(mdoc1.toString());
                    expect(results[2].toString()).toEqual(mdoc2.toString());
                    done();
                },
                error => {
                    expect(error).toBeUndefined();
                    done();
                },
                () => {
                    done();
                }
            );
        });

    });

    describe('#deleteById(id)', () => {

        it('should remove record with the corresponding id', done => {
            forkJoin(
                service.addMany([mdoc1, mdoc2]),
                service.getAll(),
                service.deleteById('1'),
                service.getAll(),
                service.deleteById('2'),
                service.getAll()
            ).subscribe(
                results => {
                    // THEN: add MediaDocs
                    expect(results[0].toString()).toEqual([mdoc1, mdoc2].toString());
                    expect(results[1].toString()).toEqual([mdoc1, mdoc2].toString());
                    // THEN: get MediaDocs
                    expect(results[2]).toEqual(mdoc1);
                    expect(results[3].toString()).toEqual([mdoc2].toString());
                    expect(results[4]).toEqual(mdoc2);
                    expect(results[5].toString()).toEqual([].toString());
                    done();
                },
                error => {
                    expect(error).toBeUndefined();
                    done();
                },
                () => {
                    done();
                }
            );
        });

        it('should not removing anything if record with corresponding id is not found', done => {
            forkJoin(
                service.addMany([mdoc1, mdoc2]),
                service.getAll(),
                service.deleteById('3'),
                service.getAll()
            ).subscribe(
                results => {
                    // THEN: add MediaDocs
                    expect(results[0].toString()).toEqual([mdoc1, mdoc2].toString());
                    expect(results[1].toString()).toEqual([mdoc1, mdoc2].toString());
                    // THEN: get MediaDocs
                    expect(results[2]).toEqual(undefined);
                    expect(results[3].toString()).toEqual([mdoc1, mdoc2].toString());
                    done();
                },
                error => {
                    expect(error).toBeUndefined();
                    done();
                },
                () => {
                    done();
                }
            );
        });

    });
    describe('#updateById(id, values)', () => {

        it('should return record with the corresponding id and updated data', done => {
            forkJoin(
                service.addMany([mdoc1, mdoc2]),
                service.getAll(),
                service.updateById('1', {
                    id: '1', name: 'new name', type: 'image', subtype: '5'
                }),
                service.getById('1')
            ).subscribe(
                results => {
                    // THEN: add MediaDocs
                    expect(results[0].toString()).toEqual([mdoc1, mdoc2].toString());
                    expect(results[1].toString()).toEqual([mdoc1, mdoc2].toString());
                    // THEN: get MediaDocs
                    expect(results[2].name).toEqual('new name');
                    expect(results[3].name).toEqual('new name');
                    done();
                },
                error => {
                    expect(error).toBeUndefined();
                    done();
                },
                () => {
                    done();
                }
            );
        });

        it('should return null if record is not found', done => {
            forkJoin(
                service.addMany([mdoc1, mdoc2]),
                service.getAll(),
                service.updateById('26', {
                    id: '26', name: 'new name', type: 'image', subtype: '5'
                }),
                service.getById('26')
            ).subscribe(
                results => {
                    // THEN: add MediaDocs
                    expect(results[0].toString()).toEqual([mdoc1, mdoc2].toString());
                    expect(results[1].toString()).toEqual([mdoc1, mdoc2].toString());
                    // THEN: get MediaDocs
                    expect(results[2]).toEqual(null);
                    expect(results[3]).toEqual(undefined);
                    done();
                },
                error => {
                    expect(error).toBeUndefined();
                    done();
                },
                () => {
                    done();
                }
            );
        });
    });
});
