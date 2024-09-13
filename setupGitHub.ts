import simpleGit, { SimpleGit, SimpleGitOptions } from 'simple-git';
import path from 'path';

const gitOptions: Partial<SimpleGitOptions> = {
  baseDir: process.cwd(),
  binary: 'git',
  maxConcurrentProcesses: 6,
};

const git: SimpleGit = simpleGit(gitOptions);

interface GitHubSetupOptions {
  commitMessage: string;
  remoteRepo: string;
  branch?: string;
}

/**
 * Initializes a git repository, adds all files, commits, and pushes to the specified GitHub repository.
 * 
 * @param {GitHubSetupOptions} options - The options for setting up the GitHub repository.
 * @returns {Promise<void>} A promise that resolves when the operation completes.
 */
export async function setupGitHubRepo({
  commitMessage,
  remoteRepo,
  branch = 'main',
}: GitHubSetupOptions): Promise<void> {
  try {
    // Initialize a Git repository if not already initialized
    if (!(await git.checkIsRepo())) {
      console.log('Initializing git repository...');
      await git.init();
    }

    // Add remote repository if it doesn't exist
    const remotes = await git.getRemotes();
    if (!remotes.some(remote => remote.name === 'origin')) {
      console.log(`Adding remote repository: ${remoteRepo}`);
      await git.addRemote('origin', remoteRepo);
    }

    // Add all files
    console.log('Adding all files...');
    await git.add('.');

    // Commit changes
    console.log(`Committing changes with message: "${commitMessage}"`);
    await git.commit(commitMessage);

    // Push to the remote repository
    console.log(`Pushing to ${branch} branch at ${remoteRepo}...`);
    await git.push('origin', branch);

    console.log('Git setup completed and changes pushed to the repository.');
  } catch (error) {
    console.error('Error during git operations:', error);
    throw error;
  }
}

