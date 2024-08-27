import { SchemaManager } from 'nstarter-entity';
import path from 'path';

export const schemaManager = SchemaManager.Initialize();

const schemaPath = path.join(__dirname, '../resources/entities.schema.json');
schemaManager.loadSchemaDefinition(schemaPath);
