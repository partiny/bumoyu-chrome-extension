<template>
  <main class="p-16 w-300">
    <div class="flex mb-10">
      <el-button color="#615ced" plain size="small" @click="toPageAdmin">打开工作台</el-button>
    </div>
    <div class="flex items-center gap-10 mb-10">
      <el-input v-model.trim="form.content" size="small" placeholder="请输入" clearable />
      <el-button color="#615ced" size="small" @click="handleAdd">新增</el-button>
    </div>
    <el-table
      :data="table.list"
      size="small"
      stripe
      border
      height="300px"
    >
      <el-table-column label="内容（点击复制）" prop="content" show-overflow-tooltip>
        <template #default="{ row }">
          <div @click="handleCopy(row.content)">{{ row.content }}</div>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="50px">
        <template #default="{ row }">
          <el-button size="small" link type="danger" @click="handleDelete(row.id)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
  </main>
</template>

<script setup lang="ts">
import { ElMessage } from 'element-plus';
import { reactive, onBeforeMount } from 'vue';

interface ItemDto {
  id: string;
  content: string;
}

const form = reactive({
  content: ''
})
const table = reactive({
  list: [] as ItemDto[]
})
const cacheKey = 'LOCAL_RECORD'

function toPageAdmin() {
  chrome.runtime.sendMessage({
    action: 'PAGE_ADMIN_OPEN'
  })
}
function handleCopy(text: string) {
  navigator.clipboard.writeText(text)
    .then(() => {
      ElMessage.success('已复制')
    })
    .catch((err) => {
      ElMessage.error(err)
    });
}
async function handleDelete(id: string) {
  const cache = await getCacheItem(cacheKey)
  let list: ItemDto[] = JSON.parse(cache || '[]')
  list = list.filter(item => item.id !== id)
  setCacheItem(cacheKey, JSON.stringify(list))
  table.list = list
}
async function handleAdd() {
  const { content } = form
  if (!content) {
    ElMessage.warning('内容不能为空')
    return
  }
  const cache = await getCacheItem(cacheKey)
  const list = JSON.parse(cache || '[]')
  list.push({
    id: Date.now().toString(),
    content
  })
  setCacheItem(cacheKey, JSON.stringify(list))
  console.log('list')
  table.list = list
}

/**
 * 设置缓存项。
 * @param key - 缓存的键，必须是字符串。
 * @param value - 要存储的值，也必须是字符串。
 */
 async function setCacheItem(key: string, value: string): Promise<void> {
  try {
    await new Promise((resolve, reject) =>
      chrome.storage.local.set({ [key]: value }, () => {
        if (chrome.runtime.lastError) {
          return reject(chrome.runtime.lastError);
        }
        resolve(null);
      })
    );
    console.log(`缓存已成功设置: ${key} = ${value}`);
  } catch (error) {
    console.error('设置缓存失败:', error);
  }
}

/**
 * 获取缓存项。
 * @param key - 要检索的缓存键。
 * @returns 返回一个Promise，解析为找到的缓存值或undefined（如果不存在）。
 */
 async function getCacheItem(key: string): Promise<string | undefined> {
  try {
    const result = await new Promise<Record<string, string>>((resolve, reject) =>
      chrome.storage.local.get([key], (data) => {
        if (chrome.runtime.lastError) {
          return reject(chrome.runtime.lastError);
        }
        resolve(data);
      })
    );
    return result[key];
  } catch (error) {
    console.error('获取缓存失败:', error);
    throw error;
  }
}

/**
 * 删除缓存项。
 * @param key - 要删除的缓存键。
 */
 async function removeCacheItem(key: string): Promise<void> {
  try {
    await new Promise((resolve, reject) =>
      chrome.storage.local.remove(key, () => {
        if (chrome.runtime.lastError) {
          return reject(chrome.runtime.lastError);
        }
        resolve(null);
      })
    );
    console.log(`缓存项已删除: ${key}`);
  } catch (error) {
    console.error('删除缓存失败:', error);
  }
}

onBeforeMount(async () => {
  const cache = await getCacheItem(cacheKey)
  table.list = JSON.parse(cache || '[]')
})
</script>