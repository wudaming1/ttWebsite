# 上线所用的git地址
releaseGit='https://github.com/wudaming1/ttWebsiteP.git'

# 当前分支
branch=`git branch | grep -e '^*' | cut -d' ' -f 2`

# 必须得在master下才可操作
if [ "$branch" == 'master' ]
then
  # 先编译
  npm run build:prod

  # 万一没有编译成功，在此退出
  test ! -d dist/tt-website && echo 'no dist/tt-website directory' && exit

  cd ./dist

  # tt-website-release为发布所用的目录，如已存在，则先进行删除操作
  test -d tt-website-release && rm -rf tt-website-release

  # 先拉取releaseGit 至 tt-website-release目录，并清空目录
  git clone $releaseGit tt-website-release && rm -rf tt-website-release/*

  # 将tt-website中的所有文件复制至tt-website-release目录
  # cp -R tt-website/* tt-website-release/
  rsync -av -e ssh --exclude='*.js.map' tt-website/* tt-website-release/

  cd tt-website-release
  # 正常push及打tag操作
  git add . && git commit -m 'Auto-commit' && git push
  # tag
  git tag 'www/'$(date +"%Y-%m-%d.%H%M") && git push --tags
else
  echo 'please merge to master!'
fi
