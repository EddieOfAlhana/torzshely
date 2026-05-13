#!/bin/sh
exec ./node_modules/.bin/vite preview --host --port ${PORT:-4173}
