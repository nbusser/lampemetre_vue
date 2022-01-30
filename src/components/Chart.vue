<template>
    <div id="chart"></div>
</template>

<script lang="ts">
import ModelTube from '@/model/ModelTube';
import { defineComponent } from 'vue';
import {
  Layout, Shape, Data, PlotMouseEvent, newPlot, redraw, PlotData,
} from 'plotly.js';

interface PlotHTMLElement extends HTMLElement {
  // eslint-disable-next-line @typescript-eslint/ban-types
  on(eventName: string, handler: Function): void;
}

export default defineComponent({
  name: 'Chart',
  data: () => {
    const rootHtml = null as PlotHTMLElement | null;
    const curves = [] as Data[];
    const annotations: Partial<Shape>[] = [];
    const layout = {
      width: 900,
      height: 600,
      shapes: annotations,
      xaxis: {
        title: 'Tension anode (V)',
        titlefont: {
          size: 18,
        },
      },
      yaxis: {
        title: 'Intensité cathode (mA)',
        titlefont: {
          size: 18,
        },
      },
      legend: {
        title: { text: 'Tension grille' },
      },
    } as Partial<Layout>;

    return {
      rootHtml,
      curves,
      annotations,
      layout,
    };
  },
  mounted() {
    this.rootHtml = document.getElementById('chart') as PlotHTMLElement;
    newPlot(this.rootHtml, this.curves as Data[], this.layout as Partial<Layout>);

    // Maybe listen to all single mutation
    // this.$store.subscribe((mutation, state) => {
    //   console.log(mutation.type);
    //   console.log(mutation.payload);
    // });
  },
  computed: {
    tubes() {
      return this.$store.state.tubes;
    },
  },
  watch: {
    tubes: {
      handler() {
        this.refresh();
      },
      deep: true,
    },
  },
  methods: {
    refresh() {
      this.curves.splice(0, this.curves.length);
      this.$store.state.tubes.forEach((tube) => {
        tube.captures.forEach((capture) => {
          const trace: PlotData = {
            x: capture.uAnode,
            y: capture.iCathode,
            mode: 'lines+markers',
            type: 'scatter',
            marker: {
              color: 'rgba(255, 0, 0, 1.0)',
            },
            name: capture.toString(),
          } as PlotData;

          this.curves.push(trace);
        });
      });
      redraw(this.rootHtml as PlotHTMLElement);
    },
  },
});
</script>
