/**
 * 毛玻璃指令
 */
export const grass = {
  mounted(el: HTMLElement, binding: { value: string }) {
    el.style.backdropFilter = 'blur(10px)';
    el.style.backgroundColor = binding.value ?? 'rgba(92, 107, 192, 0.4)';
  },
};
