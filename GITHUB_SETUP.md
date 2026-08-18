# GitHub Setup Guide

## Step 1: Create GitHub Repository

1. Go to https://github.com
2. Sign up or login
3. Click the "+" icon (top right) → "New repository"
4. Fill in:
   - **Repository name**: `infraall` (or any name you prefer)
   - **Description**: "INFRAALL - Property rental and sale platform"
   - **Visibility**: Choose Public or Private
   - ⚠️ **DON'T** check "Add README" (we already have one)
5. Click "Create repository"

## Step 2: Push Your Code to GitHub

Open terminal/command prompt in your project folder:

```bash
# Navigate to your project
cd "c:\Users\hp\Downloads\JaiLikki\KothiLikki-main\KothiLikki-main"

# Initialize Git (if not already done)
git init

# Add all files
git add .

# Commit
git commit -m "Initial commit - INFRAALL property platform"

# Add GitHub remote (replace YOUR-USERNAME with your GitHub username)
git remote add origin https://github.com/YOUR-USERNAME/infraall.git

# Push to GitHub
git branch -M main
git push -u origin main
```

## Step 3: Verify Upload

1. Refresh your GitHub repository page
2. You should see all your files uploaded
3. Check that `.env` files are NOT uploaded (they should be ignored)

## Step 4: Update Repository Settings (Optional)

1. Go to your repository on GitHub
2. Click "Settings"
3. Scroll down to "Branches"
4. Add branch protection rules if needed

## Common Issues

### Issue: Permission denied
**Solution**: Set up GitHub authentication
```bash
# Use GitHub CLI (easier)
# Install from: https://cli.github.com/
gh auth login

# OR use SSH keys
# https://docs.github.com/en/authentication/connecting-to-github-with-ssh
```

### Issue: `.env` files are visible
**Solution**: Remove them from Git
```bash
git rm --cached backend/.env
git rm --cached frontend/.env
git commit -m "Remove .env files"
git push
```

### Issue: "fatal: not a git repository"
**Solution**: Make sure you're in the correct directory
```bash
cd "c:\Users\hp\Downloads\JaiLikki\KothiLikki-main\KothiLikki-main"
git init
```

## What's Next?

After pushing to GitHub:
1. ✅ Your code is backed up
2. ✅ You can now deploy to Render/Vercel (they connect to GitHub)
3. ✅ You can share code with team members
4. ✅ You have version control

**Now follow the DEPLOYMENT.md guide to deploy your app!**
