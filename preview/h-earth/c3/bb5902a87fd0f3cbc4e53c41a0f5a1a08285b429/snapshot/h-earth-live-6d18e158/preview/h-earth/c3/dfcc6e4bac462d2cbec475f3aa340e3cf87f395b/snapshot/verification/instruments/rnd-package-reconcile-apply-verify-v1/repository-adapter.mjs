import crypto from "node:crypto";
import { gitBlobSha } from "./package-validator.mjs";

function commitSha(seed) {
  return crypto.createHash("sha1").update(seed).digest("hex");
}

export class InMemoryRepositoryAdapter {
  constructor({ head = "0".repeat(40), files = {}, failBeforeWrite = false, failAtWriteIndex = null, corruptReadbackPath = null } = {}) {
    this.head = head;
    this.files = new Map(Object.entries(files));
    this.failBeforeWrite = failBeforeWrite;
    this.failAtWriteIndex = failAtWriteIndex;
    this.corruptReadbackPath = corruptReadbackPath;
    this.writeCount = 0;
  }

  async readHead() { return this.head; }

  async readPath(path) {
    const content = this.files.get(path);
    if (content === undefined) return null;
    const effective = path === this.corruptReadbackPath ? `${content}\nCORRUPTED` : content;
    return Object.freeze({ path, content: effective, blobSha: gitBlobSha(effective) });
  }

  async writePath({ path, content, expectedCurrentBlob }) {
    if (this.failBeforeWrite && this.writeCount === 0) throw new Error("WRITE_FAILED_BEFORE_FIRST_MUTATION");
    if (this.failAtWriteIndex === this.writeCount) throw new Error(`WRITE_FAILED_AT_INDEX:${this.writeCount}`);
    const current = await this.readPath(path);
    if (expectedCurrentBlob && current?.blobSha !== expectedCurrentBlob) throw new Error(`STALE_PATH:${path}`);
    this.files.set(path, content);
    this.writeCount += 1;
    const blobSha = gitBlobSha(content);
    this.head = commitSha(`${this.head}:${path}:${blobSha}:${this.writeCount}`);
    return Object.freeze({ commitSha: this.head, contentBlobSha: blobSha });
  }
}

export class GitHubContentsRepositoryAdapter {
  constructor({ repository, branch, token, fetchImpl = globalThis.fetch }) {
    if (!repository || !branch || !token || typeof fetchImpl !== "function") {
      throw new Error("GITHUB_CONTENTS_ADAPTER_CONFIGURATION_INVALID");
    }
    this.repository = repository;
    this.branch = branch;
    this.token = token;
    this.fetch = fetchImpl;
  }

  headers() {
    return {
      Accept: "application/vnd.github+json",
      Authorization: `Bearer ${this.token}`,
      "X-GitHub-Api-Version": "2022-11-28"
    };
  }

  async request(url, options = {}) {
    const response = await this.fetch(url, { ...options, headers: { ...this.headers(), ...(options.headers || {}) } });
    if (!response.ok) throw new Error(`GITHUB_API_${response.status}:${await response.text()}`);
    return response.json();
  }

  async readHead() {
    const value = await this.request(`https://api.github.com/repos/${this.repository}/git/ref/heads/${encodeURIComponent(this.branch)}`);
    return value.object.sha;
  }

  async readPath(path) {
    const value = await this.request(`https://api.github.com/repos/${this.repository}/contents/${path}?ref=${encodeURIComponent(this.branch)}`);
    return Object.freeze({ path, content: Buffer.from(value.content, "base64").toString("utf8"), blobSha: value.sha });
  }

  async writePath({ path, content, expectedCurrentBlob, message }) {
    const value = await this.request(`https://api.github.com/repos/${this.repository}/contents/${path}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        message,
        content: Buffer.from(content, "utf8").toString("base64"),
        sha: expectedCurrentBlob,
        branch: this.branch
      })
    });
    return Object.freeze({ commitSha: value.commit.sha, contentBlobSha: value.content.sha });
  }
}
