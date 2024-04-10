currentDirectory:: / useCaseSensitiveFileNames: false
Input::
//// [/a/username/project/src/file1.ts] Inode:: 5


//// [/a/username/project/tsconfig.json] Inode:: 6
{
  "watchOptions": {
    "synchronousWatchDirectory": true
  }
}

//// [/a/lib/lib.d.ts] Inode:: 8
/// <reference no-default-lib="true"/>
interface Boolean {}
interface Function {}
interface CallableFunction {}
interface NewableFunction {}
interface IArguments {}
interface Number { toExponential: any; }
interface Object {}
interface RegExp {}
interface String { charAt: any; }
interface Array<T> { length: number; [n: number]: T; }


/a/lib/tsc.js --w -p /a/username/project/tsconfig.json
Output::
>> Screen clear
[[90mHH:MM:SS AM[0m] Starting compilation in watch mode...

[[90mHH:MM:SS AM[0m] Found 0 errors. Watching for file changes.



//// [/a/username/project/src/file1.js] Inode:: 9



FsWatches::
/a/lib/lib.d.ts: *new*
  {"inode":8}
/a/username/project/src/file1.ts: *new*
  {"inode":5}
/a/username/project/tsconfig.json: *new*
  {"inode":6}

Timeout callback:: count: 1
1: pollPollingIntervalQueue *new*

Program root files: [
  "/a/username/project/src/file1.ts"
]
Program options: {
  "watch": true,
  "project": "/a/username/project/tsconfig.json",
  "configFilePath": "/a/username/project/tsconfig.json"
}
Program structureReused: Not
Program files::
/a/lib/lib.d.ts
/a/username/project/src/file1.ts

Semantic diagnostics in builder refreshed for::
/a/lib/lib.d.ts
/a/username/project/src/file1.ts

Shape signatures in builder refreshed for::
/a/lib/lib.d.ts (used version)
/a/username/project/src/file1.ts (used version)

exitCode:: ExitStatus.undefined

Change:: Rename file1 to file2

Input::
//// [/a/username/project/src/file2.ts] Inode:: 10


//// [/a/username/project/src/file1.ts] deleted

Output::
sysLog:: /a/username/project/src/file1.ts:: Changing watcher to MissingFileSystemEntryWatcher


PolledWatches::
/a/username/project/src/file1.ts: *new*
  {"pollingInterval":250}

FsWatches::
/a/lib/lib.d.ts:
  {"inode":8}
/a/username/project/tsconfig.json:
  {"inode":6}

FsWatches *deleted*::
/a/username/project/src/file1.ts:
  {"inode":5}

Timeout callback:: count: 2
1: pollPollingIntervalQueue
2: timerToUpdateProgram *new*

Before running Timeout callback:: count: 2
1: pollPollingIntervalQueue
2: timerToUpdateProgram

After running Timeout callback:: count: 3

Timeout callback:: count: 3
2: timerToUpdateProgram *deleted*
3: timerToUpdateProgram *new*
4: pollLowPollingIntervalQueue *new*
5: pollPollingIntervalQueue *new*

Before running Timeout callback:: count: 3
3: timerToUpdateProgram
4: pollLowPollingIntervalQueue
5: pollPollingIntervalQueue

After running Timeout callback:: count: 3
Output::
>> Screen clear
[[90mHH:MM:SS AM[0m] File change detected. Starting incremental compilation...

[[90mHH:MM:SS AM[0m] Found 0 errors. Watching for file changes.



//// [/a/username/project/src/file2.js] Inode:: 11



PolledWatches *deleted*::
/a/username/project/src/file1.ts:
  {"pollingInterval":250}

FsWatches::
/a/lib/lib.d.ts:
  {"inode":8}
/a/username/project/src/file2.ts: *new*
  {"inode":10}
/a/username/project/tsconfig.json:
  {"inode":6}

Timeout callback:: count: 3
6: timerToUpdateProgram *new*
7: pollLowPollingIntervalQueue *new*
8: pollPollingIntervalQueue *new*


Program root files: [
  "/a/username/project/src/file2.ts"
]
Program options: {
  "watch": true,
  "project": "/a/username/project/tsconfig.json",
  "configFilePath": "/a/username/project/tsconfig.json"
}
Program structureReused: Not
Program files::
/a/lib/lib.d.ts
/a/username/project/src/file2.ts

Semantic diagnostics in builder refreshed for::
/a/username/project/src/file2.ts

Shape signatures in builder refreshed for::
/a/username/project/src/file2.ts (computed .d.ts)

exitCode:: ExitStatus.undefined
