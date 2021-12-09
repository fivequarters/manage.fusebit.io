import { LogData, LogEntry, LogEntryError } from '@interfaces/logs';
import { useEffect, useState } from 'react';
import { EditorEvents } from '../../../enums/editor';
import { logWithTime } from './utils';

interface Props {
  isMounted: boolean;
}

const useEditorEvents = ({ isMounted }: Props) => {
  const [isSaving, setIsSaving] = useState(false);
  const [errorBuild, setErrorBuild] = useState('');
  const [logs, setLogs] = useState<{ msg: string; id: number }[]>([]);

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
        setLogs([...logs, logWithTime(e.error)]);
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
