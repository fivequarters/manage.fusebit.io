export interface LogEntry {
  data: string;
  name: string;
}

export interface LogData {
  msg: string;
  level: number;
}

export interface LogEntryError {
  error: string;
  name: string;
}

export interface LogError {
  message: string;
  name: string;
}
