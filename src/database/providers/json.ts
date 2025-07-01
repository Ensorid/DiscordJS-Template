import { promises as fs } from "fs";
import path from "path";
import { DatabaseProvider } from "../provider";

export class JSONProvider implements DatabaseProvider {
	private filePath: string;

	constructor(fileName = "db.json") {
		this.filePath = path.resolve(__dirname, "../data", fileName);
	}

	private async read(): Promise<Record<string, unknown>> {
		try {
			const content = await fs.readFile(this.filePath, "utf-8");
			return JSON.parse(content);
		} catch (err) {
			if ((err as NodeJS.ErrnoException).code === "ENOENT") {
				await this.write({});
				return {};
			}
			throw err;
		}
	}

	private async write(data: Record<string, unknown>): Promise<void> {
		await fs.writeFile(this.filePath, JSON.stringify(data, null, 2));
	}

	async get<T = unknown>(key: string): Promise<T | null> {
		const data = await this.read();
		return (data[key] as T) ?? null;
	}

	async set<T = unknown>(key: string, value: T): Promise<void> {
		const data = await this.read();
		data[key] = value;
		await this.write(data);
	}

	async delete(key: string): Promise<void> {
		const data = await this.read();
		delete data[key];
		await this.write(data);
	}
}
