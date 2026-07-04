<script setup lang="ts">
defineProps<{
  variant?:
    | "primary"
    | "secondary"
    | "danger"
    | "warning"
    | "success"
    | "info"
    | "ghost";
  outline?: boolean;
  size?: "xs" | "sm" | "md" | "lg";
  block?: boolean;
  disabled?: boolean;
  loading?: boolean;
  type?: "button" | "submit" | "reset";
}>();

defineEmits<{
  (e: "click", event: MouseEvent): void;
}>();
</script>

<template>
  <button
    :type="type ?? 'button'"
    :disabled="disabled || loading"
    :class="[
      'inline-flex items-center justify-center gap-2 transition duration-150 cursor-pointer',
      {
        'w-full': block,
        'opacity-70 pointer-events-none': loading,
        'disabled:opacity-50 disabled:cursor-not-allowed': !loading,
      },
      // Size
      {
        'px-2 py-1 text-xs rounded': size === 'xs',
        'px-2 py-1.5 text-sm rounded': size === 'sm',
        'px-4 py-2 text-sm font-medium rounded-lg': size === 'md' || !size,
        'px-6 py-3 text-base font-semibold rounded-lg': size === 'lg',
      },
      // Filled variants
      !outline && {
        'bg-teal-600 text-white hover:bg-teal-700':
          variant === 'primary' || !variant,
        'bg-gray-300 text-gray-800 hover:bg-gray-400': variant === 'secondary',
        'bg-red-500 text-white hover:bg-red-600': variant === 'danger',
        'bg-amber-500 text-white hover:bg-amber-600': variant === 'warning',
        'bg-green-600 text-white hover:bg-green-700': variant === 'success',
        'bg-indigo-600 text-white hover:bg-indigo-700': variant === 'info',
        'text-teal-600 hover:bg-teal-50': variant === 'ghost',
      },
      // Outline variants
      outline && {
        'border border-teal-600 text-teal-600 bg-white hover:bg-teal-50':
          variant === 'primary' || !variant,
        'border border-gray-300 text-gray-700 bg-white hover:bg-gray-100':
          variant === 'secondary',
        'border border-red-500 text-red-500 bg-white hover:bg-red-50':
          variant === 'danger',
        'border border-amber-500 text-amber-500 bg-white hover:bg-amber-50':
          variant === 'warning',
        'border border-green-600 text-green-600 bg-white hover:bg-green-50':
          variant === 'success',
        'border border-indigo-600 text-indigo-600 bg-white hover:bg-indigo-50':
          variant === 'info',
        'text-teal-600 hover:bg-teal-50': variant === 'ghost',
      },
    ]"
    @click="$emit('click', $event)"
  >
    <span v-if="loading" class="animate-spin">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        class="h-4 w-4"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
      >
        <circle cx="12" cy="12" r="10" stroke-opacity="0.25" />
        <path d="M12 2a10 10 0 0 1 10 10" />
      </svg>
    </span>
    <slot v-if="!loading" name="icon" />
    <slot v-if="!loading" />
  </button>
</template>
