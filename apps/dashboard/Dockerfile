
FROM node:20-alpine

WORKDIR /app 

# installing the dependencies
RUN npm install -g pnpm turbo

# copy the config first
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml turbo.json ./

COPY apps/dashboard/package.json ./apps/dashboard/
COPY packages/ ./packages/

# installing dependecnies 
RUN pnpm install --frozen-lockfile

COPY apps/dashboard ./apps/dashboard 

ARG NEXT_PUBLIC_API_URL=http://localhost:3001
ARG NEXT_PUBLIC_GOOGLE_CLIENT_ID
ARG NEXT_PUBLIC_GOOGLE_CLIENT_SECRET
ARG NEXT_PUBLIC_NEXTAUTH_SECRET
ARG NEXT_PUBLIC_NEXTAUTH_URL=http://localhost:3000
ARG NEXT_PUBLIC_BASE_URL=http://localhost:3000
ARG NEXT_PUBLIC_DOC_URL=http://localhost:3002

ENV NEXT_PUBLIC_API_URL=$NEXT_PUBLIC_API_URL
ENV NEXT_PUBLIC_GOOGLE_CLIENT_ID=$NEXT_PUBLIC_GOOGLE_CLIENT_ID
ENV NEXT_PUBLIC_GOOGLE_CLIENT_SECRET=$NEXT_PUBLIC_GOOGLE_CLIENT_SECRET
ENV NEXT_PUBLIC_NEXTAUTH_SECRET=$NEXT_PUBLIC_NEXTAUTH_SECRET
ENV NEXT_PUBLIC_NEXTAUTH_URL=$NEXT_PUBLIC_NEXTAUTH_URL
ENV NEXT_PUBLIC_BASE_URL=$NEXT_PUBLIC_BASE_URL
ENV NEXT_PUBLIC_DOC_URL=$NEXT_PUBLIC_DOC_URL


# Build the dashboard app
RUN pnpm --filter dashboard run build

EXPOSE 3000

# Start the dashboard application
CMD ["pnpm", "--filter", "dashboard", "run", "start"]
