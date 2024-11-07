<template>
  <VMenu
    v-model="comboMenu"
    :close-on-content-click="false"
    location="bottom center"
    :offset="5"
    :disabled="disabled"
    transition="slide-y-transition"
  >
    <template v-slot:activator="{ props }">
      <div
        v-bind="props"
        class="py-[7px] px-[12px] border-[1px] border-bc rounded-[8px] flex_between gap-[10px] min-h-[4rem] cursor-pointer"
      >
        <!-- content -->
        <div class="w-full flex items-center flex-wrap gap-[6px]">
          <template v-if="selectedContentArray.length">
            <div
              v-for="(items, index) in selectedContentArray"
              :key="items.value + index"
              class="flex items-center gap-[6px] rounded-[30px] h-[2.4rem] px-[10px] bg-gray-100"
              @click.stop="() => {}"
            >
              <span
                class="elipsis font-Inter text-xs font-medium linear__background clip__background"
              >
                <span>{{ items.label }}</span>
              </span>
              <button
                :disabled="disabled"
                @click.stop="disabled ? doNothng() : toggleItem(items, false)"
                class="group flex_center cursor-pointer min-w-max w-max"
              >
                <SvgXMark class="w-[0.8rem] h-[0.8rem]" />
              </button>
            </div>
          </template>
          <div
            v-if="comboType && comboType === 'filter'"
            @click.stop="comboMenu = true"
            style="flex: auto"
          >
            <input
              class="focusedInput"
              :class="{ comboMenu }"
              style="
                width: 100%;
                height: auto;
                min-height: auto !important;
                border: none;
                box-shadow: none !important;
                background: transparent !important;
                padding: 0 !important;
                border-radius: 0 !important;
              "
              :id="inputId"
              ref="comboBoxInput"
              type="text"
              placeholder=""
              required
              v-model="filterInput"
              @keydown="checkAndDelete"
              :disabled="disabled"
            />
          </div>
        </div>
        <!-- icon -->
        <div class="flex_center min-w-max max-w-max">
          <SvgAngleDown />
        </div>
      </div>
    </template>
    <VList class="dropDownList dropList flex flex-col gap-[1px]" max-height="320">
      <template v-if="listArray.length">
        <VListItem
          v-for="(items, index) in listArray"
          :key="index + items.value"
          :ripple="true"
          class=""
          :disabled="disabled"
          @click.stop="disabled ? doNothng() : toggleItem(items)"
        >
          <div class="flex items-center gap-[8px]">
            <BaseCheck
              text-class="capitalize elipsis text-xs text-dark-1 mb-0"
              :title="items.label"
              :is-check="selectedContent.includes(items.value)"
              :disabled="disabled"
              @change="disabled ? doNothng() : toggleItem(items)"
            />
          </div>
        </VListItem>
      </template>
      <template
        v-else-if="!listArray.length && props.comboType && props.comboType === 'filter'"
      >
        <VListItem disabled class="noBefore text-center">
          <VListItemTitle class=""> No item matches your search </VListItemTitle>
        </VListItem>
      </template>
    </VList>
  </VMenu>
</template>

<script lang="ts" setup>
import { ref, computed, watch, getCurrentInstance } from "vue";
const { $deepClone } = useNuxtApp();
const props = defineProps({
  comboType: {
    type: String,
    default: "", // filter
  },
  inputId: {
    type: String,
    default: "",
  },
  disabled: {
    type: Boolean,
    default: false,
  },
  content: {
    type: Array,
    default: () => [],
  },
  selectedContent: {
    type: Array,
    default: () => [],
    required: true,
  },
});
const componentEmit = defineEmits(["update"]);
const instance = getCurrentInstance();

const comboMenu = ref(false);
const contentArray = ref([]);
const filterInput = ref<string>("");
const selectedContentArray = computed(() => {
  if (props.selectedContent.length) {
    return props.content.filter((el: any) => {
      return props.selectedContent.includes(el.value);
    });
  }
  return [];
});
const listArray = computed(() => {
  let conData = $deepClone(props.content);
  if (props.comboType === "filter") {
    if (filterInput.value) {
      conData = conData.filter((el: any) => {
        return el.value
          .toLocaleLowerCase()
          .includes(filterInput.value.toLocaleLowerCase());
      });
    }
  }
  return conData;
});

watch(comboMenu, () => {
  if (comboMenu.value) focusComboInput();
});

const checkAndDelete = (event: KeyboardEvent) => {
  if (props.disabled) return;
  if (event.key === "Backspace" && !filterInput.value) {
    let dataToEmit = $deepClone(props.selectedContent);
    if (dataToEmit?.length) {
      dataToEmit.pop();
      componentEmit("update", dataToEmit);
    }
  }
};
const deleteFromContentArray = (index: number) => {
  if (props.disabled) return;
  contentArray.value.splice(index, 1);
};
const doNothng = () => {
  return;
};
const focusComboInput = () => {
  if (props.comboType === "filter") {
    const inputRef = instance?.proxy?.$refs?.comboBoxInput as HTMLInputElement;
    if (inputRef) inputRef.focus();
  }
};
const toggleItem = (item: any, focus: boolean = true) => {
  if (props.disabled) return;
  filterInput.value = "";
  const dataIndex = props.selectedContent.findIndex(
    (element: any) => element === item.value
  );
  let dataToEmit = [];
  if (dataIndex === -1) {
    dataToEmit = [...props.selectedContent, item.value];
  } else {
    dataToEmit = $deepClone(props.selectedContent);
    dataToEmit.splice(dataIndex, 1);
  }
  componentEmit("update", dataToEmit);
  if (focus) focusComboInput();
};
</script>

<style></style>
