//#module i18n
export const LOCALE_COOKIE_KEY = 'locale';
//#endmodule i18n
export const DEFAULT_LOG_ROTATE_DAYS = 14;

//#module ws_server|ws_emitter
// Room key prefix for websocket message
export const WS_MSG_ROOM_KEY = 'ws_msg:';
//#endmodule ws_server|ws_emitter

// Time to wait before starting shutdown
export const SHUTDOWN_WAIT_MS = 10000;

//#module web
// Time to wait before force shutdown http server
export const HTTP_SHUTDOWN_MS = 20000;
//#endmodule web
