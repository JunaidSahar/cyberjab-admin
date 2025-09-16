<template>
  <div class="bg-darkForground p-6 border border-border rounded-lg w-full">
    <div class="pb-5 text-headingColor">
      <h3 class="font-bold text-2xl">Revenue</h3>
      <p class="text-sm"><span class="text-green-500">+24%</span> in past 30 days</p>
    </div>
  <AreaChart
    :data="data"
    :categories="categories"
    :height="300"
    :xFormatter="xFormatter"
    xLabel="Month"
    yLabel="Amount"
    hideLegend="true"
  />
  </div>
</template>

<script setup>
import { AreaChart } from 'vue-chrts';

const data = [
  { month: '1',  revenue: 55 },
  { month: '2',  revenue: 60 },
  { month: '3',  revenue: 80 },
  { month: '4',  revenue: 75 },
  { month: '5',  revenue: 55 },
  { month: '6',  revenue: 67 },
  { month: '7',  revenue: 80 },
  { month: '8',  revenue: 80 },
  { month: '9',  revenue: 75 },
  { month: '10',  revenue: 60 },
  { month: '11',  revenue: 55 },
  { month: '12',  revenue: 60 },
  { month: '13',  revenue: 55 },
  { month: '14',  revenue: 75 },
  { month: '15',  revenue: 60 },
  { month: '16',  revenue: 55 },
  { month: '17',  revenue: 45 },
  { month: '18',  revenue: 80 },
  { month: '19',  revenue: 75 },
  { month: '20',  revenue: 60 },
];

const categories = {
  revenue: {
    name: 'Revenue',
    color: '#0800F7'
  },
};

const xFormatter = (i) => data[i].month;
</script>
