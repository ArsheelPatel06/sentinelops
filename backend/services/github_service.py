from github import Github
import logging
from backend.config import Config

logger = logging.getLogger(__name__)

class GitHubService:
    def __init__(self):
        self.enabled = False
        self.is_configured = False
        if Config.GITHUB_TOKEN:
            try:
                self.github = Github(Config.GITHUB_TOKEN)
                self.enabled = True
                self.is_configured = True
            except Exception as e:
                logger.warning(f"GitHub initialization failed: {e}. Running in mock mode.")

    def get_repo_branches(self, repo_name):
        if not self.enabled:
            return ['main', 'develop', 'feature/auth-flow', 'release/v1.0.0']
        try:
            repo = self.github.get_repo(repo_name)
            return [b.name for b in repo.get_branches()]
        except Exception as e:
            logger.error(f"Error querying GitHub branches: {e}")
            return ['main', 'develop']

    def get_repo_commits(self, repo_name, branch='main', limit=5):
        if not self.enabled:
            return self._get_mock_commits(branch, limit)
        try:
            repo = self.github.get_repo(repo_name)
            commits = repo.get_commits(sha=branch)
            commit_list = []
            for i, commit in enumerate(commits):
                if i >= limit:
                    break
                commit_list.append({
                    'sha': commit.sha[:7],
                    'message': commit.commit.message.split('\n')[0],
                    'author': commit.commit.author.name,
                    'date': commit.commit.author.date.isoformat(),
                    'url': commit.html_url
                })
            return commit_list
        except Exception as e:
            logger.error(f"Error querying GitHub commits: {e}")
            return self._get_mock_commits(branch, limit)

    def get_pull_requests(self, repo_name, state='open', limit=5):
        if not self.enabled:
            return self._get_mock_prs(limit)
        try:
            repo = self.github.get_repo(repo_name)
            prs = repo.get_pulls(state=state)
            pr_list = []
            for i, pr in enumerate(prs):
                if i >= limit:
                    break
                pr_list.append({
                    'number': pr.number,
                    'title': pr.title,
                    'author': pr.user.login,
                    'branch': pr.head.ref,
                    'status': 'open' if pr.state == 'open' else 'closed',
                    'updated_at': pr.updated_at.isoformat()
                })
            return pr_list
        except Exception as e:
            logger.error(f"Error querying GitHub PRs: {e}")
            return self._get_mock_prs(limit)

    def _get_mock_commits(self, branch, limit):
        from datetime import datetime, timedelta
        
        mocks = [
            {'sha': 'a3f8d12', 'message': 'Implement secure JWT validation layer', 'author': 'Arjun S.', 'offset': 1},
            {'sha': 'b9e1234', 'message': 'Fix PostgreSQL pool leak in Auth-Service', 'author': 'Priya M.', 'offset': 2},
            {'sha': 'c7d5678', 'message': 'Fix Tailwind layout shift on Projects page', 'author': 'Rohan K.', 'offset': 3},
            {'sha': 'd2a9012', 'message': 'Add health check probe path for Kubernetes ingress', 'author': 'Sona T.', 'offset': 5},
            {'sha': 'e5f6g7h', 'message': 'Add multi-region RDS configuration instructions', 'author': 'Arjun S.', 'offset': 8}
        ]
        
        result = []
        for i in range(min(limit, len(mocks))):
            mock = mocks[i]
            dt = datetime.utcnow() - timedelta(hours=mock['offset'])
            result.append({
                'sha': mock['sha'],
                'message': mock['message'],
                'author': mock['author'],
                'date': dt.isoformat() + 'Z',
                'url': f"https://github.com/org/repo/commit/{mock['sha']}"
            })
        return result

    def _get_mock_prs(self, limit):
        mocks = [
            {'number': 142, 'title': 'Add rate limiting configurations to API gateways', 'author': 'arjun', 'branch': 'feature/rate-limiting', 'updated': 2},
            {'number': 141, 'title': 'Upgrade Lodash dependency to resolve CVE-2020-8203', 'author': 'sona', 'branch': 'security/upgrade-lodash', 'updated': 5},
            {'number': 140, 'title': 'Implement user authentication MFA toggling', 'author': 'priya', 'branch': 'feature/mfa-auth', 'updated': 12}
        ]
        
        from datetime import datetime, timedelta
        result = []
        for i in range(min(limit, len(mocks))):
            mock = mocks[i]
            dt = datetime.utcnow() - timedelta(hours=mock['updated'])
            result.append({
                'number': mock['number'],
                'title': mock['title'],
                'author': mock['author'],
                'branch': mock['branch'],
                'status': 'open',
                'updated_at': dt.isoformat() + 'Z'
            })
        return result
