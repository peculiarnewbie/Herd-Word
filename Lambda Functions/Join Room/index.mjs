import { Redis } from "@upstash/redis"
import Ably from 'ably'

const redis = new Redis({
    url: process.env.HERD_UPSTASH_REDIS_REST_URL,
    token:process.env.HERD_UPSTASH_REDIS_REST_TOKEN,
})


export const handler = async (event, context) => {
    const roomId = event.roomId;
    const userId = event.userId;
    const fromCookie = event.fromCookie
    
    console.log({roomId, userId, fromCookie})

    const keys = [`herdword:${roomId}`, `herdword:${roomId}:players`, `herdword:${roomId}:messages`];
	const args = ["round", `${userId}`, fromCookie]

    const joinRoom = await redis.eval(
        `
        local function checkPlayer(name)
            local exist = redis.call('ZSCORE', KEYS[2], name)
            return exist
        end

        local function GetPlayers()
            redis.call('ZADD', KEYS[2], 0, ARGV[2])
            local players = redis.call('ZRANGE', KEYS[2], 0, -1)
            local string = table.concat(players, '", "')
            return string
        end

        local currentRound = redis.call('HGET', KEYS[1], 'round')
        local roomInfo = redis.call('HGETALL', KEYS[1])
        local roomInfoString = table.concat(roomInfo, '", "')

        if not currentRound then
            return '{"code": 101, "message": "create room", "players": ["' .. ARGV[2] .. '"]}'
        elseif currentRound == '0' then
            local exist = checkPlayer(ARGV[2])
            if exist and ARGV[3] == 'false'  then
                return '{"code": 104, "message":"name exists in room", "players": "null", "roomInfo": ["' .. roomInfoString .. '"]}'
            else
                local playersString = GetPlayers()
                
                if exist then
                    return '{"code": 103, "message": "Welcome Back", "players": ["' .. playersString .. '"], "roomInfo": ["' .. roomInfoString .. '"]}'
                else
                    return '{"code": 102, "message": "Joined Room", "players": ["' .. playersString .. '"], "roomInfo": ["' .. roomInfoString .. '"]}'
                end
            end
        else
            local exist = checkPlayer(ARGV[2])
            if exist and ARGV[3] == 'true' then
                local playersString = GetPlayers()
                return '{"code": 103, "message": "Welcome Back", "players": ["' .. playersString .. '"], "roomInfo": ["' .. roomInfoString .. '"]}'
            else
                --check for hot joining
                return '{"code": 105, "message":"room is playing", "players": "null", "roomInfo": ["' .. roomInfoString .. '"]}'
            end
        end`,
        keys,
        args
    );

    console.log("we here", joinRoom);

    let parsed = JSON.parse(JSON.stringify(joinRoom));

    let roomInfo = {}

    for(let i = 0; i < parsed.roomInfo.length; i += 2){
        roomInfo[parsed.roomInfo[i]] = parsed.roomInfo[i+1]
    }

    parsed.roomInfo = roomInfo

    if(parsed.code == 102)
    {
        const ably = new Ably.Realtime.Promise(process.env.HERD_ABLY_API_KEY)
        await ably.connection.once('connected');
        const channel = ably.channels.get(`herdword:${roomId}`);
        await channel.publish(`:players`, userId);
        console.log("published")
        ably.close()
    }

    const response = {
        statusCode: 200,
        headers: { 
          'Access-Control-Allow-Origin': 'https://herd-word-qx25ygijz-peculiarnewbie.vercel.app/',
            'Access-Control-Allow-Credentials': true,
            'Access-Control-Allow-Headers': 'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token',
            'Access-Control-Allow-Methods': 'OPTIONS,POST,GET'
        },
        body: joinRoom
      };


    
    return response
}