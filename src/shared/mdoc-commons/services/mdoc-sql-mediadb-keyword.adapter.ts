import {CommonSqlKeywordAdapter} from '@dps/mycms-commons/dist/action-commons/actions/common-sql-keyword.adapter';

export class MediaDocSqlMediadbKeywordAdapter {

    private readonly commonSqlKeywordAdapter: CommonSqlKeywordAdapter;

    constructor(config: any, knex: any, commonSqlKeywordAdapter: CommonSqlKeywordAdapter) {
        this.commonSqlKeywordAdapter = commonSqlKeywordAdapter;
    }

    public setAudioKeywords(dbId: number, keywords: string, opts: any): Promise<any> {
        return this.setGenericKeywords('audio', dbId, keywords, opts);
    }

    public setAlbumKeywords(dbId: number, keywords: string, opts: any): Promise<any> {
        return this.setGenericKeywords('album', dbId, keywords, opts);
    }

    public setArtistKeywords(dbId: number, keywords: string, opts: any): Promise<any> {
        return this.setGenericKeywords('artist', dbId, keywords, opts);
    }

    protected setGenericKeywords(table: string, dbId: number, keywords: string, opts: any): Promise<any> {
        return this.commonSqlKeywordAdapter.setGenericKeywords(table, dbId, keywords, opts, true);
    }
}
