import { Client } from '@elastic/elasticsearch';
import { config } from './config';

export const esClient = new Client({ node: config.elasticsearch.node });

const INDEX_NAME = 'documents';

export const ensureIndex = async () => {
  try {
    const indexExists = await esClient.indices.exists({ index: INDEX_NAME });
    if (!indexExists) {
      await esClient.indices.create({
        index: INDEX_NAME,
        body: {
          mappings: {
            properties: {
              title: { type: 'text' },
              content_text: { type: 'text' },
              workspace_id: { type: 'keyword' },
              doc_type: { type: 'keyword' },
              created_by: { type: 'keyword' },
              created_at: { type: 'date' },
              updated_at: { type: 'date' }
            }
          }
        }
      });
      console.log(`Created index ${INDEX_NAME}`);
    }
  } catch (error) {
    console.error('Error ensuring Elasticsearch index:', error);
  }
};

export const indexDocument = async (doc: any) => {
  try {
    await esClient.index({
      index: INDEX_NAME,
      id: doc.id,
      body: {
        title: doc.title,
        content_text: doc.content_text || '',
        workspace_id: doc.workspace_id,
        doc_type: doc.doc_type || 'document',
        created_by: doc.created_by,
        created_at: doc.created_at,
        updated_at: doc.updated_at
      }
    });
  } catch (error) {
    console.error(`Error indexing document ${doc.id}:`, error);
  }
};

export const removeDocument = async (docId: string) => {
  try {
    await esClient.delete({
      index: INDEX_NAME,
      id: docId
    });
  } catch (error) {
    console.error(`Error removing document ${docId}:`, error);
  }
};

export const search = async (query: string, workspaceId: string, docType?: string, page: number = 1, limit: number = 10) => {
  try {
    const from = (page - 1) * limit;
    
    const must: any[] = [
      {
        multi_match: {
          query,
          fields: ['title^3', 'content_text']
        }
      }
    ];

    const filter: any[] = [
      { term: { workspace_id: workspaceId } }
    ];

    if (docType) {
      filter.push({ term: { doc_type: docType } });
    }

    const response = await esClient.search({
      index: INDEX_NAME,
      from,
      size: limit,
      body: {
        query: {
          bool: {
            must,
            filter
          }
        },
        highlight: {
          fields: {
            title: {},
            content_text: {}
          }
        }
      }
    });

    return response.hits.hits.map((hit: any) => ({
      id: hit._id,
      source: hit._source,
      highlight: hit.highlight
    }));
  } catch (error) {
    console.error('Error executing search:', error);
    return [];
  }
};
