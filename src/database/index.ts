import { DatabaseProvider } from "./provider";
import { JSONProvider } from "./providers/json";
import { SQLiteProvider } from "./providers/sqlite";

let provider: DatabaseProvider;

export function initDatabase(type: "json" | "sqlite" = "json") {
	if (type === "json") {
		provider = new JSONProvider();
	} else if (type === "sqlite") {provider = new SQLiteProvider();} else {
		throw new Error(`Unknown database type: ${type}`);
	}
}

export function db(): DatabaseProvider {
	if (!provider) throw new Error("Database not initialized");
	return provider;
}
