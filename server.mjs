import { createApp, eventHandler, createEventStream, setResponseHeaders, sendStream, toNodeListener } from 'h3';
import { ReadableStream } from 'node:stream/web';
import { createServer } from 'node:http';

const app = createApp();


app.use('/stream', eventHandler(async (event) => {

    const eventStream = createEventStream(event);

    setResponseHeaders(event, {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
    });


    const messages = [
        `data: ${JSON.stringify({ text: 'First chunk' })}\n\n`,
        `data: ${JSON.stringify({ text: 'Second chunk' })}\n\n`,
        `data: ${JSON.stringify({ text: 'Third chunk' })}\n\n`,
        'data: [DONE]\n\n'
    ];

    try {
        console.log('before eventStream.send()')
        for (const message of messages) {
            await eventStream.push(message)
        }
        await eventStream.send()

        console.log('after eventStream.send()')

    } catch (error) {
        console.error('error', error);
        throw error;
    }
}));

const server = createServer(toNodeListener(app))

server.listen(3000, () => {
    console.log('Server listening on port 3000')
})