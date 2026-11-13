import { init, use } from 'echarts/core';
import { LineChart, BarChart } from 'echarts/charts';
import { GridComponent, TooltipComponent, LegendComponent, DataZoomComponent } from 'echarts/components';
import { CanvasRenderer } from 'echarts/renderers';
use([LineChart, BarChart, GridComponent, TooltipComponent, LegendComponent, DataZoomComponent, CanvasRenderer]);
import type { alignSeries } from '../lib/chart-data.mjs';

export function renderChart(container: HTMLElement, data: ReturnType<typeof alignSeries>, hasDividends: boolean) {
    const styles = getComputedStyle(document.documentElement);
    const ink = styles.getPropertyValue('--color-ink').trim();
    const muted = styles.getPropertyValue('--color-ink-2').trim();
    const rule = styles.getPropertyValue('--color-rule').trim();
    const surface = styles.getPropertyValue('--color-surface').trim();
    const accent = styles.getPropertyValue('--color-accent').trim();
    const axisTheme = { axisLabel: { color: muted }, nameTextStyle: { color: muted }, axisLine: { lineStyle: { color: rule } }, splitLine: { lineStyle: { color: rule } } };
    container.hidden = false;
    const chart = init(container);
    chart.setOption({ color: [styles.getPropertyValue('--color-accent').trim(), styles.getPropertyValue('--color-chart-secondary').trim()], textStyle: { color: ink, fontFamily: styles.getPropertyValue('--font-body').trim() }, tooltip: { trigger: 'axis', backgroundColor: surface, borderColor: rule, textStyle: { color: ink } }, legend: { top: 8, left: 'center', data: hasDividends ? ['주가 ($)', '배당금 ($)'] : ['주가 ($)'], textStyle: { color: muted } }, grid: { left: 52, right: 50, top: 60, bottom: 80 }, xAxis: { ...axisTheme, type: 'category', data: data.dates }, yAxis: [{ ...axisTheme, type: 'value', name: '주가 ($)', scale: true }, { ...axisTheme, show: hasDividends, type: 'value', name: '배당금 ($)' }], dataZoom: [{ type: 'slider', start: 80, end: 100, textStyle: { color: muted }, borderColor: rule, backgroundColor: surface, fillerColor: 'rgba(210, 248, 106, 0.14)', handleStyle: { color: accent, borderColor: accent } }, { type: 'inside' }], series: [{ name: '주가 ($)', type: 'line', showSymbol: false, connectNulls: true, data: data.prices }, { name: '배당금 ($)', type: 'bar', yAxisIndex: 1, data: data.dividends }] });
    const observer = new ResizeObserver(() => chart.resize());
    observer.observe(container);
    return () => { observer.disconnect(); chart.dispose(); };
}
