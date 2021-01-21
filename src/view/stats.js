import Smart from "./smart.js";
import {countPointsByType, countMoneyByType, countTimeByType, makeItemsUniq} from "../utils/stats.js";
import Chart from "chart.js";
import ChartDataLabels from 'chartjs-plugin-datalabels';

// Рассчитаем высоту канваса в зависимости от того, сколько данных в него будет передаваться
// const eventTypes = points.map((point) => point.eventType);
// const uniqueTypes = [...new Set(eventTypes)];

// const barsQuantity = uniqueTypes.length;
// const barsQuantity = 5;


const moneyChart = (moneyCtx, points) => {
  const eventTypes = points.map((point) => point.eventType);
  const uniqueTypes = makeItemsUniq(eventTypes);
  const moneyData = uniqueTypes.map((type) => {
    return countMoneyByType(points, type);
  });
  return new Chart(moneyCtx, {
    plugins: [ChartDataLabels],
    type: `horizontalBar`,
    data: {
      labels: uniqueTypes.map((type) => type.toUpperCase()),
      datasets: [{
        data: moneyData,
        backgroundColor: `#ffffff`,
        hoverBackgroundColor: `#ffffff`,
        anchor: `start`
      }]
    },
    options: {
      plugins: {
        datalabels: {
          font: {
            size: 13
          },
          color: `#000000`,
          anchor: `end`,
          align: `start`,
          formatter: (val) => `€ ${val}`
        }
      },
      title: {
        display: true,
        text: `MONEY`,
        fontColor: `#000000`,
        fontSize: 23,
        position: `left`
      },
      scales: {
        yAxes: [{
          ticks: {
            fontColor: `#000000`,
            padding: 5,
            fontSize: 13,
          },
          gridLines: {
            display: false,
            drawBorder: false
          },
          barThickness: 44,
        }],
        xAxes: [{
          ticks: {
            display: false,
            beginAtZero: true,
          },
          gridLines: {
            display: false,
            drawBorder: false
          },
          minBarLength: 50
        }],
      },
      legend: {
        display: false
      },
      tooltips: {
        enabled: false,
      }
    }
  });
};

const typeChart = (typeCtx, points) => {
  const eventTypes = points.map((point) => point.eventType);
  const uniqueTypes = makeItemsUniq(eventTypes);
  const countData = uniqueTypes.map((type) => {
    return countPointsByType(points, type);
  });
  return new Chart(typeCtx, {
    plugins: [ChartDataLabels],
    type: `horizontalBar`,
    data: {
      labels: uniqueTypes.map((type) => type.toUpperCase()),
      datasets: [{
        data: countData,
        backgroundColor: `#ffffff`,
        hoverBackgroundColor: `#ffffff`,
        anchor: `start`
      }]
    },
    options: {
      plugins: {
        datalabels: {
          font: {
            size: 13
          },
          color: `#000000`,
          anchor: `end`,
          align: `start`,
          formatter: (val) => `${val}x`
        }
      },
      title: {
        display: true,
        text: `TYPE`,
        fontColor: `#000000`,
        fontSize: 23,
        position: `left`
      },
      scales: {
        yAxes: [{
          ticks: {
            fontColor: `#000000`,
            padding: 5,
            fontSize: 13,
          },
          gridLines: {
            display: false,
            drawBorder: false
          },
          barThickness: 44,
        }],
        xAxes: [{
          ticks: {
            display: false,
            beginAtZero: true,
          },
          gridLines: {
            display: false,
            drawBorder: false
          },
          minBarLength: 50
        }],
      },
      legend: {
        display: false
      },
      tooltips: {
        enabled: false,
      }
    }
  });
};

const timeChart = (timeCtx, points) => {
  const eventTypes = points.map((point) => point.eventType);
  const uniqueTypes = makeItemsUniq(eventTypes);
  const timeData = uniqueTypes.map((type) => {
    return countTimeByType(points, type);
  });
  return new Chart(timeCtx, {
    plugins: [ChartDataLabels],
    type: `horizontalBar`,
    data: {
      labels: uniqueTypes.map((type) => type.toUpperCase()),
      datasets: [{
        data: timeData,
        backgroundColor: `#ffffff`,
        hoverBackgroundColor: `#ffffff`,
        anchor: `start`
      }]
    },
    options: {
      plugins: {
        datalabels: {
          font: {
            size: 13
          },
          color: `#000000`,
          anchor: `end`,
          align: `start`,
          formatter: (val) => `${val}D`
        }
      },
      title: {
        display: true,
        text: `TIME-SPEND`,
        fontColor: `#000000`,
        fontSize: 23,
        position: `left`
      },
      scales: {
        yAxes: [{
          ticks: {
            fontColor: `#000000`,
            padding: 5,
            fontSize: 13,
          },
          gridLines: {
            display: false,
            drawBorder: false
          },
          barThickness: 44,
        }],
        xAxes: [{
          ticks: {
            display: false,
            beginAtZero: true,
          },
          gridLines: {
            display: false,
            drawBorder: false
          },
          minBarLength: 50
        }],
      },
      legend: {
        display: false
      },
      tooltips: {
        enabled: false,
      }
    }
  });
};


const createStatsTemplate = (points) => {
  const barsQuantity = makeItemsUniq(points).length;
  const BAR_HEIGHT = 55;
  // moneyCtx.height = BAR_HEIGHT * barsQuantity;
  // typeCtx.height = BAR_HEIGHT * barsQuantity;
  // timeCtx.height = BAR_HEIGHT * barsQuantity;
  const height = BAR_HEIGHT * barsQuantity;
  return `<section class="statistics">
    <h2 class="visually-hidden">Trip statistics</h2>

    <div class="statistics__item statistics__item--money">
      <canvas class="statistics__chart  statistics__chart--money" width="900" height="${height}"></canvas>
    </div>

    <div class="statistics__item statistics__item--transport">
      <canvas class="statistics__chart  statistics__chart--transport" width="900" height="${height}"></canvas>
    </div>

    <div class="statistics__item statistics__item--time-spend">
      <canvas class="statistics__chart  statistics__chart--time" width="900" height="${height}"></canvas>
    </div>
  </section>`;
};

export default class Stats extends Smart {
  constructor(points) {
    super();

    this._data = {
      points,
    };

    this._moneyChart = null;
    this._transportChart = null;
    this._timeChart = null;

    this._setCharts();
  }

  removeElement() {
    super.removeElement();

    if (this._moneyChart !== null || this._transportChart !== null || this._timeChart !== null) {
      this._moneyChart = null;
      this._transportChart = null;
      this._timeChart = null;
    }
  }

  getTemplate() {
    const {points} = this._data;
    return createStatsTemplate(points);
  }

  _setCharts() {
    if (this._moneyChart !== null || this._transportChart !== null || this._timeChart !== null) {
      this._moneyChart = null;
      this._transportChart = null;
      this._timeChart = null;
    }

    const {points} = this._data;
    const moneyCtx = this.getElement().querySelector(`.statistics__chart--money`);
    const typeCtx = this.getElement().querySelector(`.statistics__chart--transport`);
    const timeCtx = this.getElement().querySelector(`.statistics__chart--time`);

    this._moneyChart = moneyChart(moneyCtx, points);
    this._transportChart = typeChart(typeCtx, points);
    this._timeChart = timeChart(timeCtx, points);
  }
}
