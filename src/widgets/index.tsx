import { declareIndexPlugin, AppEvents, ReactRNPlugin, WidgetLocation } from '@remnote/plugin-sdk';
import '../style.css';
import '../App.css';
import {remIdKey} from '../lib/constants';

let timer: number;
let openWidgetInfo: { floatingWidgetId: string; remId: string } | undefined;

async function onActivate(plugin: ReactRNPlugin) {
  await plugin.app.registerWidget('hover_editor', WidgetLocation.FloatingWidget, {
    dimensions: { height: 'auto', width: '500px' },
  });

  plugin.event.addListener(AppEvents.MouseOverLink, undefined, (args) => {
    clearTimeout(timer);
    timer = setTimeout(async () => {
      const rem = await plugin.rem.findOne(args.remId);
      if (rem) {
        await plugin.storage.setSession(remIdKey, args.remId);
        const isOpen =
          openWidgetInfo?.floatingWidgetId &&
          (await plugin.window.isFloatingWidgetOpen(
            openWidgetInfo?.floatingWidgetId
          ));
        if (isOpen || !timer) {
          return;
        }
        const floatingWidgetId = await plugin.window.openFloatingWidget(
          "hover_editor",
          {
            left: args.clientX,
            top: args.clientY + 20,
          }
        );
        openWidgetInfo = { floatingWidgetId, remId: args.remId };
      }
    }, 500);
  });

  plugin.event.addListener(AppEvents.MouseOutLink, undefined, async () => {
    if (timer) {
      clearTimeout(timer);
    }
  });
}

async function onDeactivate(_: ReactRNPlugin) {}

declareIndexPlugin(onActivate, onDeactivate);
