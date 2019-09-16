const Pusher = require("pusher");

var channels_client = new Pusher({
  appId: "863080",
  key: "40ebca8b93d271070a0a",
  secret: "09fe86fd661d522e5282",
  cluster: "us3",
  encrypted: true
});

channels_client.trigger("my-channel", "my-event", {
  message: "hello world"
});

// const channels_client = Pusher.forCluster("CLUSTER", {
//     appId: 'APP_ID',
//     key: 'APP_KEY',
//     secret: 'SECRET_KEY',
//     useTLS: USE_TLS, // optional, defaults to false
//     port: PORT, // optional, defaults to 80 for non-TLS connections and 443 for TLS connections
//     encryptionMasterKey: ENCRYPTION_MASTER_KEY, // a 32 character long key used to derive secrets for end to end encryption (see below!)
//   });

// const channels_client = Pusher.forURL("SCHEME://APP_KEY:SECRET_KEY@HOST:PORT/apps/APP_ID");

// Additional options
// There are a few additional options that can be used in all above methods:

// const channels_client = new Pusher({
//     // you can set other options in any of the 3 ways described above
//     proxy: 'HTTP_PROXY_URL', // optional, URL to proxy the requests through
//     timeout: TIMEOUT, // optional, timeout for all requests in milliseconds
//     keepAlive: KEEP_ALIVE // optional, enables keep-alive, defaults to false
//   });

// channels_client.trigger("channel-1", "test_event", { message: "hello world" });

// channels_client.trigger([ 'channel-1', 'channel-2' ], 'test_event', { message: "hello world" });

// const events = [{
//     channel: "channel-1",
//     name: "test-event-1",
//     data: {message: "hello world"}
//   },
//   {
//     channel: "channel-2",
//     name: "test-event-2",
//     data: {message: "hello another world"}
//   }];

//   channels_client.triggerBatch(events);

module.exports = {
  channels_client
};
