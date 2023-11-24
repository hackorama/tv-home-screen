# start server in the background and track pid

echo "Stopping server `cat run.pid` ..."
kill `cat run.pid`

echo "Starting server ..."
nohup ruby -run -ehttpd . -p9001 > server.log & echo $! > run.pid

echo "Started server `cat run.pid` ..."
echo "To see server logs:"
echo "  tail -f server.log"
