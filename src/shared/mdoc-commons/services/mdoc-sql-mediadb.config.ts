import {TableConfig, TableConfigs} from '@dps/mycms-commons/dist/search-commons/services/sql-query.builder';
import {SqlMediaDbAlbumConfig} from '../model/repository/sql-mediadb-album.config';
import {SqlMediaDbAudioConfig} from '../model/repository/sql-mediadb-audio.config';
import {SqlMediaDbArtistConfig} from '../model/repository/sql-mediadb-artist.config';
import {SqlMediaDbGenreConfig} from '../model/repository/sql-mediadb-genre.config';
import {KeywordModelConfigType} from '@dps/mycms-commons/dist/action-commons/actions/common-sql-keyword.adapter';
import {PlaylistModelConfigType} from '@dps/mycms-commons/dist/action-commons/actions/common-sql-playlist.adapter';
import {RateModelConfigType} from '@dps/mycms-commons/dist/action-commons/actions/common-sql-rate.adapter';
import {JoinModelConfigsType} from '@dps/mycms-commons/dist/action-commons/actions/common-sql-join.adapter';
import {ActionTagAssignConfigType} from '@dps/mycms-commons/dist/action-commons/actiontags/common-sql-actiontag-assign.adapter';
import {ActionTagAssignJoinConfigType} from '@dps/mycms-commons/dist/action-commons/actiontags/common-sql-actiontag-assignjoin.adapter';
import {ActionTagBlockConfigType} from '@dps/mycms-commons/dist/action-commons/actiontags/common-sql-actiontag-block.adapter';
import {ActionTagReplaceConfigType} from '@dps/mycms-commons/dist/action-commons/actiontags/common-sql-actiontag-replace.adapter';
import {SqlMediaDbPlaylistConfig} from '../model/repository/sql-mediadb-playlist.config';

export class MediaDocSqlMediadbConfig {
    public static readonly tableConfigs: TableConfigs = {
        'album': SqlMediaDbAlbumConfig.tableConfig,
        'artist': SqlMediaDbArtistConfig.tableConfig,
        'audio': SqlMediaDbAudioConfig.tableConfig,
        'genre': SqlMediaDbGenreConfig.tableConfig,
        'playlist': SqlMediaDbPlaylistConfig.tableConfig,
    };

    public static readonly keywordModelConfigType: KeywordModelConfigType = {
        table: 'keyword',
        fieldId: 'kw_id',
        fieldName: 'kw_name',
        joins: {
            'album': SqlMediaDbAlbumConfig.keywordModelConfigType,
            'artist': SqlMediaDbArtistConfig.keywordModelConfigType,
            'audio': SqlMediaDbAudioConfig.keywordModelConfigType
        }
    };

    public static readonly playlistModelConfigType: PlaylistModelConfigType = {
        table: 'playlist',
        fieldId: 'p_id',
        fieldName: 'p_name',
        joins: {
            'audio': SqlMediaDbAudioConfig.playlistModelConfigType
        }
    };

    public static readonly rateModelConfigType: RateModelConfigType = {
        tables: {
            'album': SqlMediaDbAlbumConfig.rateModelConfigType,
            'albumaudios': SqlMediaDbAudioConfig.rateModelConfigTypeAlbumAudios,
            'artist': SqlMediaDbArtistConfig.rateModelConfigType,
            'audio': SqlMediaDbAudioConfig.rateModelConfigType,
            'genre': SqlMediaDbGenreConfig.rateModelConfigType
        }
    };

    public static readonly joinModelConfigType: JoinModelConfigsType = {
        'linkedartists': {
            name: 'linkedartists',
            tables: {
                'album': SqlMediaDbAlbumConfig.joinModelConfigTypeLinkedArtists
            }
        },
    };

    public static readonly actionTagAssignConfig: ActionTagAssignConfigType = {
        tables: {
            'album': SqlMediaDbAlbumConfig.actionTagAssignConfig,
            'artist': SqlMediaDbArtistConfig.actionTagAssignConfig,
            'audio': SqlMediaDbAudioConfig.actionTagAssignConfig,
            'genre': SqlMediaDbGenreConfig.actionTagAssignConfig,
        }
    };

    public static readonly actionTagAssignJoinConfig: ActionTagAssignJoinConfigType = {
        tables: {
            'album': SqlMediaDbAlbumConfig.actionTagAssignJoinConfig
        }
    };

    public static readonly actionTagBlockConfig: ActionTagBlockConfigType = {
        tables: {
            'album': SqlMediaDbAlbumConfig.actionTagBlockConfig,
            'artist': SqlMediaDbArtistConfig.actionTagBlockConfig,
            'audio': SqlMediaDbAudioConfig.actionTagBlockConfig,
            'genre': SqlMediaDbGenreConfig.actionTagBlockConfig,
        }
    };

    public static readonly actionTagReplaceConfig: ActionTagReplaceConfigType = {
        tables: {
            'album': SqlMediaDbAlbumConfig.actionTagReplaceConfig,
            'artist': SqlMediaDbArtistConfig.actionTagReplaceConfig,
            'audio': SqlMediaDbAudioConfig.actionTagReplaceConfig,
            'genre': SqlMediaDbGenreConfig.actionTagReplaceConfig,
        }
    };

    public getTableConfigForTableKey(table: string): TableConfig {
        return MediaDocSqlMediadbConfig.tableConfigs[table];
    }

    public getKeywordModelConfigFor(): KeywordModelConfigType {
        return MediaDocSqlMediadbConfig.keywordModelConfigType;
    }

    public getPlaylistModelConfigFor(): PlaylistModelConfigType {
        return MediaDocSqlMediadbConfig.playlistModelConfigType;
    }

    public getRateModelConfigFor(): RateModelConfigType {
        return MediaDocSqlMediadbConfig.rateModelConfigType;
    }

    public getJoinModelConfigFor(): JoinModelConfigsType {
        return MediaDocSqlMediadbConfig.joinModelConfigType;
    }

    public getActionTagAssignConfig(): ActionTagAssignConfigType {
        return MediaDocSqlMediadbConfig.actionTagAssignConfig;
    }

    public getActionTagAssignJoinConfig(): ActionTagAssignJoinConfigType {
        return MediaDocSqlMediadbConfig.actionTagAssignJoinConfig;
    }

    public getActionTagBlockConfig(): ActionTagBlockConfigType {
        return MediaDocSqlMediadbConfig.actionTagBlockConfig;
    }

    public getActionTagReplaceConfig(): ActionTagReplaceConfigType {
        return MediaDocSqlMediadbConfig.actionTagReplaceConfig;
    }
}

