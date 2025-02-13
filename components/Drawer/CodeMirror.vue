<template>
  <div
    id="codeMirror"
    class="text-base dark:text-slate-300 text-slate-700 h-full"
  ></div>
</template>

<script lang="ts">
import Vue from "vue";
import { EditorState, Extension, StateField } from "@codemirror/state";
import { classHighlightStyle } from "@codemirror/highlight";
import { history, historyKeymap } from "@codemirror/history";
import { codeFolding, foldGutter } from "@codemirror/fold";
import { foldService } from "@codemirror/language";
import { Decoration, EditorView, keymap, ViewPlugin } from "@codemirror/view";
import { defaultKeymap } from "@codemirror/commands";
import { mapGetters } from "vuex";
import {
  Cascade,
  Event,
  Events,
  Range as CascadeRange,
  Range,
} from "~/src/Types";
import { Foldable } from "~/src/Parser";
import { ColorPickerWidget } from "~/src/ColorPickerWidget";
import { rgbStringToHex } from "~/src/ColorUtils";

const rightCaret = () => {
  let div = document.createElement("div");
  div.className = "h-full flex items-center content-center cursor-pointer";
  div.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clip-rule="evenodd" /></svg>`;
  return div;
};

const downCaret = () => {
  let div = document.createElement("div");
  div.className = "h-full flex items-center content-center cursor-pointer";
  div.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clip-rule="evenodd" /></svg>`;
  return div;
};

let startState = (startingText: string, extensions: Extension[] = []) =>
  EditorState.create({
    doc: startingText,
    extensions: [
      codeFolding(),
      foldGutter({
        markerDOM: (open: boolean) => {
          return !open ? rightCaret() : downCaret();
        },
      }),
      keymap.of([...defaultKeymap, ...historyKeymap]),
      history(),
      classHighlightStyle,
      EditorView.lineWrapping,
      ...extensions,
    ],
  });

const dateRangeMark = Decoration.mark({ class: "cm-daterange" });
const commentMark = Decoration.mark({ class: "cm-comment" });
const sectionMark = Decoration.mark({ class: "cm-section" });
const tagMark = Decoration.mark({ class: "cm-tag" });
const eventMark = Decoration.mark({ class: "cm-event" });
const hoveringEventMark = Decoration.mark({ class: "cm-event-hover" });

export default Vue.extend({
  props: ["startingText"],
  computed: {
    ...mapGetters(["cascadeString"]),
    ...mapGetters(["ranges", "cascade"]),
    rangeOffset(): number {
      return (this.cascade as Cascade).metadata.startStringIndex;
    },
    adjustedRanges(): Range[] {
      return (this.ranges as Range[]).map(({ from, to, type, content }) => {
        return {
          type,
          content,
          from: from - this.rangeOffset,
          to: to - this.rangeOffset,
        };
      });
    },
  },
  data() {
    return {
      editorView: null as EditorView | null,
    };
  },
  watch: {
    cascadeString(val, oldVal) {
      if (val !== this.editorView?.state.sliceDoc()) {
        const transaction = this.editorView!.state.update({
          changes: {
            from: 0,
            to: this.editorView!.state.doc.length,
            insert: val,
          },
        });
        this.editorView?.dispatch(transaction);
      }
    },
  },
  mounted() {
    this.editorView = new EditorView({
      state: startState(
        this.$store.getters.cascadeString,
        // this.update,
        this.codeMirrorExtensions()
      ),
      parent: this.$el,
    });
    this.$store.commit("setEditorGetter", () => this.editorView);
  },
  methods: {
    doneChoosingColor(e: MouseEvent | TouchEvent) {
      this.$store.commit("setChoosingColor", false);
      document.removeEventListener("mousedown", this.doneChoosingColor);
      document.removeEventListener("touchstart", this.doneChoosingColor);
    },
    setColorForTag(tag: string, color: string) {
      const vm = this;
      const ranges = vm.adjustedRanges as CascadeRange[];

      if (!vm.editorView) {
        return;
      }

      const alreadyDefinedRanges = ranges.filter(
        (r) => r.type === "tagDefinition"
      );

      // Find if we have already defined this tag color
      const alreadyDefined = alreadyDefinedRanges.find(
        (r) => r.content.tag === tag
      );
      if (alreadyDefined) {
        // We can just replace this range with our new value
        const transaction = vm.editorView.state.update({
          changes: {
            from: alreadyDefined.from,
            to: alreadyDefined.to,
            insert: `#${tag}: ${color}`,
          },
        });
        vm.editorView.update([transaction]);
      } else if (!alreadyDefinedRanges.length) {
        // We have no other range definitions, just
        // put it at the top
        const transaction = vm.editorView.state.update({
          changes: {
            from: 0,
            insert: `#${tag}: ${color}\n`,
          },
        });
        vm.editorView.update([transaction]);
      } else {
        const last = alreadyDefinedRanges[alreadyDefinedRanges.length - 1];
        const endIndexOfPreviousRange = last.to;
        const transaction = vm.editorView.state.update({
          changes: {
            from: endIndexOfPreviousRange,
            insert: `\n#${tag}: ${color}`,
          },
        });
        vm.editorView.update([transaction]);
      }
    },
    colorPickerExtension(): Extension {
      const vm = this;
      const colorPickerPlugin = ViewPlugin.define((view) => ({ update() {} }), {
        decorations() {
          const ranges = (vm.adjustedRanges as CascadeRange[])
            .filter((range) => range.type === "tag")
            .map((r) => {
              const asHex = rgbStringToHex(r.content.color);
              const widget = Decoration.widget({
                widget: new ColorPickerWidget(asHex, r.content.tag),
                side: 0,
                block: false,
              });
              return widget.range(r.from);
            })
            .sort((a, b) => a.from - b.from);
          return Decoration.set(ranges);
        },
        eventHandlers: {
          click(e, view) {
            let target = e.target as HTMLInputElement;
            if (
              !target.parentElement!.classList.contains("cm-colorPickerWrapper")
            ) {
              return;
            }
            vm.$store.commit("setChoosingColor", true);
            document.addEventListener("mousedown", vm.doneChoosingColor);
            document.addEventListener("touchstart", vm.doneChoosingColor);
          },
          change: (e, view) => {
            let target = e.target as HTMLInputElement;
            if (
              target.parentElement!.classList.contains("cm-colorPickerWrapper")
            ) {
              const tagIndex = view.posAtDOM(target);
              const associatedTagRange = (
                vm.adjustedRanges as CascadeRange[]
              ).find((r) => r.type === "tag" && r.from === tagIndex);
              if (!associatedTagRange) {
                return false;
              }
              const newColor = target.value;
              vm.setColorForTag(associatedTagRange.content.tag, newColor);
            }
            return false;
          },
        },
      });
      return colorPickerPlugin;
    },
    cascadeExtension(): Extension {
      const vm = this;
      const cascadeField = StateField.define<Cascade>({
        create() {
          return vm.cascade as Cascade;
        },
        update(cascade, transaction) {
          if (transaction.docChanged) {
            vm.$store.dispatch(
              "setCascadeString",
              transaction.state.sliceDoc()
            );
            return vm.cascade;
          }
          return cascade;
        },
      });
      return cascadeField.extension;
    },
    syntaxExtension(): Extension {
      const vm = this;
      const CascadeSyntaxPlugin = ViewPlugin.define(
        (view) => {
          return {};
        },
        {
          decorations() {
            return Decoration.set(
              ((vm.adjustedRanges as CascadeRange[]) || [])
                .flatMap((r) => {
                  if (r.type === "dateRange") {
                    return [dateRangeMark.range(r.from, r.to)];
                  }
                  if (r.type === "section") {
                    return [sectionMark.range(r.from, r.to)];
                  }
                  if (r.type === "tag") {
                    return [tagMark.range(r.from, r.to)];
                  }
                  if (["title", "description"].includes(r.type)) {
                    return [sectionMark.range(r.from, r.to)];
                  }
                  if (r.type === "comment") {
                    return [commentMark.range(r.from, r.to)];
                  }
                  return [];
                })
                .sort((a, b) => a.from - b.from)
            );
          },
        }
      );
      return CascadeSyntaxPlugin;
    },
    foldingServiceExtension(): Extension {
      const vm = this;
      const foldingService = foldService.of((state, lineStart, lineEnd) => {
        const foldableAtIndex = vm.cascade.foldables[lineStart] as Foldable;
        if (foldableAtIndex) {
          if (foldableAtIndex.type === "comment") {
            return {
              from:
                foldableAtIndex.foldStartIndex || foldableAtIndex.startIndex!,
              to: foldableAtIndex.endIndex,
            };
          } else if (foldableAtIndex.type === "section") {
            return {
              from:
                foldableAtIndex.foldStartIndex || foldableAtIndex.startIndex!,
              to: foldableAtIndex.endIndex,
            };
          }
        }
        return null;
      });
      return foldingService;
    },
    hoverExtension(): Extension {
      const vm = this;
      const hoverPlugin = ViewPlugin.define((view) => ({}), {
        decorations: (view) => {
          const hoveringEvent = vm.$store.state.hoveringEvent as Event | null;
          if (!hoveringEvent) {
            return Decoration.set([]);
          }
          const offset = (vm.$store.getters.cascade as Cascade).metadata
            .startStringIndex;
          const from = hoveringEvent.ranges.event.from;
          const to = hoveringEvent.ranges.event.to;
          return Decoration.set([
            hoveringEventMark.range(from - offset, to - offset),
          ]);
        },
        eventHandlers: {
          mouseover(e: MouseEvent, view: EditorView) {
            if (vm.$store.state.choosingColor) {
              return false;
            }
            const position = view.posAtCoords({ x: e.x, y: e.y });
            if (!position) {
              return false;
            }
            const event = vm.$store.getters.eventAtPosition(position);
            if (vm.$store.state.hoveringEvent === event) {
              return false;
            }
            vm.$store.commit("setHovering", event);
            return true;
          },
          mouseleave(e: MouseEvent, view: EditorView) {
            if (vm.$store.state.choosingColor) {
              return false;
            }
            if (!vm.$store.state.hoveringEvent) {
              return false;
            }
            vm.$store.commit("setHovering", null);
            return false;
          },
        },
      });
      return hoverPlugin;
    },
    codeMirrorExtensions(): Extension[] {
      return [
        this.foldingServiceExtension(),
        this.syntaxExtension(),
        this.colorPickerExtension(),
        this.cascadeExtension(),
        this.hoverExtension(),
      ];
    },
  },
});
</script>

<style>
.cm-editor {
  @apply h-full;
  font-size: 95%;
}

.dark .cm-content {
  @apply caret-slate-300;
}

/* .dark .cmt-keyword {
  @apply text-red-300;
}

.cmt-keyword {
  @apply text-red-700;
} */

.cm-daterange {
  @apply text-red-800;
}

.dark .cm-daterange {
  @apply text-red-400;
}

.cm-comment {
  @apply text-slate-500;
}

.dark .cm-comment {
  @apply text-slate-400;
}

.cm-gutter {
  @apply bg-slate-200;
}

.dark .cm-gutter {
  @apply bg-slate-900;
}

.cm-gutters {
  @apply border-none !important;
}

.dark .cm-section {
  @apply text-purple-400;
}

.cm-section {
  @apply text-purple-800;
}

.dark .cm-foldPlaceholder {
  @apply bg-slate-700 border border-slate-700 text-slate-100 !important;
}

.cm-foldPlaceholder {
  @apply bg-slate-400 border border-slate-400 text-slate-100 !important;
}

.dark .cm-tag {
  @apply text-blue-300;
}

.cm-tag {
  @apply text-blue-800;
}

.cm-colorPicker {
  @apply rounded-sm cursor-pointer;
}

.cm-colorPickerWrapper {
  display: inline-flex;
  margin-right: 0.2ch;
  height: 0.6em;
  width: 0.6em;
}
.cm-colorPickerWrapper input[type="color"] {
  cursor: pointer;
  height: 100%;
  width: 100%;
  padding: 0;
  border: none;
}

.cm-colorPickerWrapper input[type="color"]::-webkit-color-swatch-wrapper {
  padding: 0;
}

.cm-colorPickerWrapper input[type="color"]::-webkit-color-swatch {
  border: none;
  border-radius: 0.125rem;
}
.cm-colorPickerWrapper input[type="color"]::-moz-color-swatch {
  border: none;
  border-radius: 0.125rem;
}
.cm-event-hover {
  @apply bg-slate-300/50 dark:bg-slate-700/50 rounded;
}
</style>