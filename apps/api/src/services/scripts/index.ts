export const fixedWindowScript = `
       local key = KEYS[1]
       local limit = tonumber(ARGV[1])
       local window = tonumber(ARGV[2])


       local current = tonumber(redis.call("GET", key)) or 0

       if tonumber(current) >= limit then 
          return {0, 0,redis.call("TTL", key) , current }
       end 

       local newCount = redis.call("INCR", key)

       if newCount == 1 then 
        redis.call("EXPIRE",key,window)
       end 

      -- allowed 
       return {1, limit-newCount , redis.call("TTL", key), newCount }
      `;

export const slidingWindowScript = `

        local key = KEYS[1]
        local now = tonumber(ARGV[1])
        local windowStart = tonumber(ARGV[2])
        local windowMs =  tonumber(ARGV[3])
        local limit = tonumber(ARGV[4])
        local member = ARGV[5]


        -- step 1 remove old entries 
        redis.call("ZREMRANGEBYSCORE", key, 0 , windowStart )

       -- step 2 get the count 
       local count = tonumber(redis.call("ZCARD",key))

       -- step 3 check against the limit 
       if count >= limit then
            local oldest = redis.call("ZRANGE", key, 0, 0, "WITHSCORES")
            local resetTime = 0

            if #oldest > 0 then
                resetTime = math.floor(tonumber(oldest[2]) / 1000) + math.floor(windowMs/1000)
            end

            return {0, 0, resetTime, count}
        end

        -- step 4 add the request
        redis.call("ZADD" , key , now , member)

        -- step 5 set expirey 
        redis.call("PEXPIRE",key , windowMs)

        -- step 6 return response 
        return {1, limit - (count+1), math.floor((now + windowMs)/1000), count+1}


  

`;
