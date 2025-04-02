import {
  addTask,
  addTaskWithPageInContent,
  addTaskWithPageInDescription,
} from "@/commands/addTask";
import { t } from "@/i18n";
import type { Translations } from "@/i18n/translation";
import type TodoistPlugin from "@/index";
import debug from "@/log";
import type { Command as ObsidianCommand } from "obsidian";

export type MakeCommand = (
  plugin: TodoistPlugin,
  i18n: Translations["commands"],
) => Omit<ObsidianCommand, "id">;

let syncCommand: MakeCommand = (plugin: TodoistPlugin, i18n: Translations["commands"]) => {
  return {
    name: i18n.sync,
    callback: async () => {
      debug("Syncing with Todoist API");
      plugin.services.todoist.sync();
    },
  };
};

let commands = {
  "todoist-sync": syncCommand,
  "add-task": addTask,
  "add-task-page-content": addTaskWithPageInContent,
  "add-task-page-description": addTaskWithPageInDescription,
};

export type CommandId = keyof typeof commands;

export let registerCommands = (plugin: TodoistPlugin) => {
  let i18n = t().commands;
  for (let [id, make] of Object.entries(commands)) {
    plugin.addCommand({ id, ...make(plugin, i18n) });
  }
};

export let fireCommand = <K extends CommandId>(id: K, plugin: TodoistPlugin) => {
  let i18n = t().commands;
  let make = commands[id];
  make(plugin, i18n).callback?.();
};
