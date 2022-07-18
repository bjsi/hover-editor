import { usePlugin, renderWidget, useRunAsync, RemHierarchyEditorTree, LoadingSpinner } from '@remnote/plugin-sdk';
import { remIdKey } from '../lib/constants';

export const HoverEditor = () => {
  const plugin = usePlugin()
  const remId = useRunAsync(async () => {
    return await plugin.storage.getSession(remIdKey);
  }, [])

  const fId = useRunAsync(async () => {
    const ctx = await plugin.widget.getWidgetContext();
    return ctx?.floatingWidgetId;
  }, [])

  return (
   <div onMouseDown={e => e.stopPropagation()} className={"p-[3px] rounded-lg box-border"}>
      <div className="overflow-y-scroll w-full rounded-lg shadow-md border-gray-100">
        <div className="p-4">
        {
          !remId
           ? <LoadingSpinner />
           : <RemHierarchyEditorTree height="expand" width="expand" remId={remId} />
        }
        </div>
      </div>
    </div>
  );
};

renderWidget(HoverEditor);
