# Worksheet 7

This repository contains my APUE lab work for Worksheet 7.

## Labs

- `apue.3e/fileio/mycat.c`
  Modified to print to `stderr` how many bytes are read from `stdin` each time `read()` succeeds.
- `apue.3e/signals/sigusr.c`
  Extended to catch `SIGCONT`, print `received SIGCONT`, and continue running.
- `cmds.log`
  Command history for compiling, running, signaling, and terminating the programs.

## Build

From the APUE directories:

```bash
cd apue.3e/lib
make PLATFORM=macos all

cd ../fileio
make PLATFORM=macos mycat

cd ../signals
make PLATFORM=macos sigusr
```

## Files To Submit

- `apue.3e/fileio/mycat.c`
- `apue.3e/signals/sigusr.c`
- `cmds.log`
