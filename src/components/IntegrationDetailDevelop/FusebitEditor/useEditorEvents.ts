import { LogData, LogEntry, LogEntryError, LogError } from '@interfaces/logs';
import { useEffect, useState } from 'react';
import { EditorEvents } from '../../../enums/editor';

interface Props {
  isMounted: boolean;
}

const useEditorEvents = ({ isMounted }: Props) => {
  const [isSaving, setIsSaving] = useState(false);
  const [errorBuild, setErrorBuild] = useState('');
  const [logs, setLogs] = useState<{ msg: string; id: number }[]>([]);

  const logWithTime = (msg: string) => {
    const id = Date.now();
    const time = new Date();
    const formattedTime = time.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: 'numeric',
      second: 'numeric',
      hour12: true,
    });
    return { id, msg: `[${formattedTime}] ${msg}` };
  };

  useEffect(() => {
    if (isMounted) {
      window.editor?.on(EditorEvents.BuildStarted, () => {
        setIsSaving(true);
        setErrorBuild('');
      });
      window.editor?.on(EditorEvents.BuildFinished, () => setIsSaving(false));
      window.editor?.on(EditorEvents.BuildError, (e: { error: { message: string } }) => {
        setIsSaving(false);
        setErrorBuild(`There was an error in the build: ${e.error.message}`);
      });
      window.editor.on(EditorEvents.LogsAttached, () => {
        setLogs([...logs, logWithTime('Attached to real-time logs...')]);
      });
      window.editor.on(EditorEvents.LogsEntry, (e: LogEntry) => {
        const logData = JSON.parse(e.data) as LogData;
        setLogs([...logs, logWithTime(logData.msg)]);
      });
      window.editor.on(EditorEvents.RunnerFinished, (e: LogEntryError) => {
        const logData = JSON.parse(e.error) as LogError;
        setLogs([...logs, logWithTime(logData.message)]);
      });
    }
  }, [isMounted, isSaving, logs]);

  return {
    isSaving,
    errorBuild,
    setErrorBuild,
    logs,
    setLogs,
  };
};

export default useEditorEvents;
