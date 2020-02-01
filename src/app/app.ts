import * as Koa from 'koa'; 
import * as HttpStatus from 'http-status-codes'; 
const app:Koa = new Koa(); 
app.use(async (ctx: Koa.Context, next: () => Promise<any>) => { try { await next(); } catch (error) { ctx.status = error.statusCode || error.status || HttpStatus.INTERNAL_SERVER_ERROR; error.status = ctx.status; ctx.body = { error }; ctx.app.emit('error', error, ctx); } }); 
app.use(async (ctx:Koa.Context) => { ctx.body = 'Hello world!'; }); 
app.on('error', console.error); export default app;