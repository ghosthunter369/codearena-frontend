@echo off
echo 正在更新 API 客户端代码...

echo.
echo 1. 重新生成问题服务 API...
npx swagger-typescript-api -p ./swagger/question.json -o ./src/api/question -n api.js --modular --axios

echo.
echo 2. 重新生成搜索服务 API...
npx swagger-typescript-api -p ./swagger/search.json -o ./src/api/search -n api.js --modular --axios

echo.
echo 3. 重新生成用户服务 API...
npx swagger-typescript-api -p ./swagger/user.json -o ./src/api/user -n api.js --modular --axios

echo.
echo ✅ API 客户端代码更新完成！
echo.

rem 不自动退出，窗口保持打开，用户可以手动关闭