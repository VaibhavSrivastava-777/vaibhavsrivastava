/**
 * GitHub API integration for committing file changes
 * This allows the admin panel to work in production by committing changes directly to GitHub
 */

interface GitHubFile {
  path: string;
  content: string;
  sha?: string; // Required for updates, optional for new files
}

interface GitHubCommitResponse {
  commit: {
    sha: string;
    html_url: string;
  };
}

class GitHubAPI {
  private owner: string;
  private repo: string;
  private token: string;
  private baseUrl: string;

  constructor() {
    this.owner = process.env.GITHUB_OWNER || "";
    this.repo = process.env.GITHUB_REPO || "";
    this.token = process.env.GITHUB_TOKEN || "";
    this.baseUrl = "https://api.github.com";

    if (!this.owner || !this.repo || !this.token) {
      console.warn("GitHub API credentials not fully configured");
    } else {
      console.log(`GitHub API configured for: ${this.owner}/${this.repo}`);
    }
  }

  /**
   * Check if GitHub API is properly configured
   */
  isConfigured(): boolean {
    return !!(this.owner && this.repo && this.token);
  }

  /**
   * Get the current SHA of a file (needed for updates)
   */
  async getFileSha(path: string, branch: string = "main"): Promise<string | null> {
    if (!this.isConfigured()) {
      throw new Error("GitHub API not configured. Please set GITHUB_OWNER, GITHUB_REPO, and GITHUB_TOKEN.");
    }

    try {
      // GitHub API expects paths with forward slashes, not URL encoded
      const url = `${this.baseUrl}/repos/${this.owner}/${this.repo}/contents/${path}?ref=${branch}`;
      
      console.log(`Getting file SHA: ${path} from ${this.owner}/${this.repo}`);
      
      const response = await fetch(url, {
        headers: {
          Authorization: `Bearer ${this.token}`,
          Accept: "application/vnd.github.v3+json",
          "User-Agent": "vaibhavsrivastava-admin-panel",
        },
      });

      if (response.status === 404) {
        return null; // File doesn't exist yet
      }

      if (!response.ok) {
        const errorText = await response.text();
        let errorMessage = `Failed to get file SHA: ${response.status}`;
        try {
          const errorData = JSON.parse(errorText);
          errorMessage += ` - ${errorData.message || errorText}`;
        } catch {
          errorMessage += ` - ${errorText}`;
        }
        throw new Error(errorMessage);
      }

      const data = await response.json();
      return data.sha;
    } catch (error: any) {
      console.error("Error getting file SHA:", error);
      throw error;
    }
  }

  /**
   * Commit a single file change
   */
  async commitFile(
    path: string,
    content: string,
    message: string,
    branch: string = "main"
  ): Promise<GitHubCommitResponse> {
    if (!this.isConfigured()) {
      throw new Error("GitHub API not configured. Please set GITHUB_OWNER, GITHUB_REPO, and GITHUB_TOKEN.");
    }

    try {
      // Get existing file SHA if it exists (for updates)
      const sha = await this.getFileSha(path, branch);

      // Encode content as base64
      const encodedContent = Buffer.from(content, "utf-8").toString("base64");

      // URL encode the path properly - GitHub API expects forward slashes, not encoded
      // But we need to encode other special characters
      const url = `${this.baseUrl}/repos/${this.owner}/${this.repo}/contents/${path}`;
      
      console.log(`Committing file: ${path} to ${this.owner}/${this.repo} on branch ${branch}`);
      
      const body: any = {
        message,
        content: encodedContent,
        branch,
      };

      if (sha) {
        body.sha = sha; // Required for updates
        console.log(`Updating existing file (SHA: ${sha.substring(0, 7)}...)`);
      } else {
        console.log(`Creating new file`);
      }

      const response = await fetch(url, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${this.token}`,
          Accept: "application/vnd.github.v3+json",
          "Content-Type": "application/json",
          "User-Agent": "vaibhavsrivastava-admin-panel",
        },
        body: JSON.stringify(body),
      });

      if (!response.ok) {
        const errorText = await response.text();
        let errorMessage = `Failed to commit file: ${response.status}`;
        try {
          const errorData = JSON.parse(errorText);
          errorMessage += ` - ${errorData.message || errorText}`;
          
          // Provide helpful error messages for common issues
          if (response.status === 404) {
            errorMessage += `\n\nPossible causes:\n`;
            errorMessage += `- Repository not found: Check GITHUB_OWNER="${this.owner}" and GITHUB_REPO="${this.repo}" are correct\n`;
            errorMessage += `- Repository URL should be: https://github.com/${this.owner}/${this.repo}\n`;
            errorMessage += `- Token doesn't have access: Ensure token has 'repo' scope\n`;
            errorMessage += `- Branch doesn't exist: Verify branch '${branch}' exists in repository\n`;
            errorMessage += `- File path issue: Path="${path}"`;
          } else if (response.status === 401 || response.status === 403) {
            errorMessage += `\n\nPossible causes:\n`;
            errorMessage += `- Invalid token: Check GITHUB_TOKEN is correct\n`;
            errorMessage += `- Token expired: Generate a new token\n`;
            errorMessage += `- Insufficient permissions: Token needs 'repo' scope`;
          }
        } catch {
          errorMessage += ` - ${errorText}`;
        }
        console.error(`GitHub API Error: ${errorMessage}`);
        throw new Error(errorMessage);
      }

      return await response.json();
    } catch (error: any) {
      console.error("Error committing file:", error);
      throw error;
    }
  }

  /**
   * Delete a file
   */
  async deleteFile(
    path: string,
    message: string,
    branch: string = "main"
  ): Promise<GitHubCommitResponse> {
    if (!this.isConfigured()) {
      throw new Error("GitHub API not configured. Please set GITHUB_OWNER, GITHUB_REPO, and GITHUB_TOKEN.");
    }

    try {
      const sha = await this.getFileSha(path, branch);
      if (!sha) {
        throw new Error(`File not found: ${path}`);
      }

      // GitHub API expects paths with forward slashes, not URL encoded
      const url = `${this.baseUrl}/repos/${this.owner}/${this.repo}/contents/${path}`;
      
      console.log(`Deleting file: ${path} from ${this.owner}/${this.repo}`);
      
      const response = await fetch(url, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${this.token}`,
          Accept: "application/vnd.github.v3+json",
          "Content-Type": "application/json",
          "User-Agent": "vaibhavsrivastava-admin-panel",
        },
        body: JSON.stringify({
          message,
          sha,
          branch,
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        let errorMessage = `Failed to delete file: ${response.status}`;
        try {
          const errorData = JSON.parse(errorText);
          errorMessage += ` - ${errorData.message || errorText}`;
        } catch {
          errorMessage += ` - ${errorText}`;
        }
        throw new Error(errorMessage);
      }

      return await response.json();
    } catch (error: any) {
      console.error("Error deleting file:", error);
      throw error;
    }
  }

  /**
   * Commit multiple files in a single commit
   */
  async commitFiles(
    files: GitHubFile[],
    message: string,
    branch: string = "main"
  ): Promise<GitHubCommitResponse> {
    if (!this.isConfigured()) {
      throw new Error("GitHub API not configured. Please set GITHUB_OWNER, GITHUB_REPO, and GITHUB_TOKEN.");
    }

    try {
      // Get the latest commit SHA
      const refUrl = `${this.baseUrl}/repos/${this.owner}/${this.repo}/git/refs/heads/${branch}`;
      const refResponse = await fetch(refUrl, {
        headers: {
          Authorization: `Bearer ${this.token}`,
          Accept: "application/vnd.github.v3+json",
        },
      });

      if (!refResponse.ok) {
        throw new Error(`Failed to get branch ref: ${refResponse.status}`);
      }

      const refData = await refResponse.json();
      const baseTreeSha = refData.object.sha;

      // Get the base tree
      const treeUrl = `${this.baseUrl}/repos/${this.owner}/${this.repo}/git/trees/${baseTreeSha}?recursive=1`;
      const treeResponse = await fetch(treeUrl, {
        headers: {
          Authorization: `Bearer ${this.token}`,
          Accept: "application/vnd.github.v3+json",
        },
      });

      if (!treeResponse.ok) {
        throw new Error(`Failed to get tree: ${treeResponse.status}`);
      }

      const treeData = await treeResponse.json();

      // Prepare tree entries
      const treeEntries: any[] = files.map((file) => {
        const existingFile = treeData.tree?.find((t: any) => t.path === file.path);
        return {
          path: file.path,
          mode: "100644", // Regular file
          type: "blob",
          content: file.content,
          sha: existingFile?.sha, // Include SHA if updating
        };
      });

      // Create blobs for new content
      const blobPromises = treeEntries.map(async (entry) => {
        if (!entry.sha) {
          // New file, create blob
          const blobUrl = `${this.baseUrl}/repos/${this.owner}/${this.repo}/git/blobs`;
          const blobResponse = await fetch(blobUrl, {
            method: "POST",
            headers: {
              Authorization: `Bearer ${this.token}`,
              Accept: "application/vnd.github.v3+json",
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              content: Buffer.from(entry.content, "utf-8").toString("base64"),
              encoding: "base64",
            }),
          });

          if (!blobResponse.ok) {
            throw new Error(`Failed to create blob: ${blobResponse.status}`);
          }

          const blobData = await blobResponse.json();
          entry.sha = blobData.sha;
        }
        return entry;
      });

      const entries = await Promise.all(blobPromises);

      // Create tree
      const createTreeUrl = `${this.baseUrl}/repos/${this.owner}/${this.repo}/git/trees`;
      const createTreeResponse = await fetch(createTreeUrl, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${this.token}`,
          Accept: "application/vnd.github.v3+json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          base_tree: baseTreeSha,
          tree: entries.map((e) => ({
            path: e.path,
            mode: e.mode,
            type: e.type,
            sha: e.sha,
          })),
        }),
      });

      if (!createTreeResponse.ok) {
        const error = await createTreeResponse.text();
        throw new Error(`Failed to create tree: ${createTreeResponse.status} ${error}`);
      }

      const newTreeData = await createTreeResponse.json();

      // Create commit
      const commitUrl = `${this.baseUrl}/repos/${this.owner}/${this.repo}/git/commits`;
      const commitResponse = await fetch(commitUrl, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${this.token}`,
          Accept: "application/vnd.github.v3+json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message,
          tree: newTreeData.sha,
          parents: [baseTreeSha],
        }),
      });

      if (!commitResponse.ok) {
        const error = await commitResponse.text();
        throw new Error(`Failed to create commit: ${commitResponse.status} ${error}`);
      }

      const commitData = await commitResponse.json();

      // Update branch reference
      const updateRefUrl = `${this.baseUrl}/repos/${this.owner}/${this.repo}/git/refs/heads/${branch}`;
      const updateRefResponse = await fetch(updateRefUrl, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${this.token}`,
          Accept: "application/vnd.github.v3+json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          sha: commitData.sha,
        }),
      });

      if (!updateRefResponse.ok) {
        const error = await updateRefResponse.text();
        throw new Error(`Failed to update ref: ${updateRefResponse.status} ${error}`);
      }

      return {
        commit: {
          sha: commitData.sha,
          html_url: `https://github.com/${this.owner}/${this.repo}/commit/${commitData.sha}`,
        },
      };
    } catch (error: any) {
      console.error("Error committing files:", error);
      throw error;
    }
  }
}

// Export singleton instance
export const githubAPI = new GitHubAPI();
