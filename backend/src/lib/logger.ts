type LogLevel = 'info' | 'warn' | 'error'

interface LogEntry {
  level: LogLevel
  msg: string
  [key: string]: unknown
}

function emit(entry: LogEntry) {
  const line = JSON.stringify({ time: new Date().toISOString(), ...entry })
  if (entry.level === 'error') {
    console.error(line)
  } else if (entry.level === 'warn') {
    console.warn(line)
  } else {
    console.log(line)
  }
}

export const logger = {
  info(msg: string, extra?: Record<string, unknown>) {
    emit({ level: 'info', msg, ...extra })
  },
  warn(msg: string, extra?: Record<string, unknown>) {
    emit({ level: 'warn', msg, ...extra })
  },
  error(msg: string, error?: unknown, extra?: Record<string, unknown>) {
    const errInfo: Record<string, unknown> = {}
    if (error instanceof Error) {
      errInfo.error = error.message
      errInfo.stack = error.stack
    } else if (error !== undefined) {
      errInfo.error = String(error)
    }
    emit({ level: 'error', msg, ...errInfo, ...extra })
  },
}
