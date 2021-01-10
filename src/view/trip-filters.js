import AbstractView from "./abstract.js";

const createFilterItemTemplate = (filter, currentFilterType) => {
  const {type, name, count} = filter;

  return (
    `<div class="trip-filters__filter">
      <input
        id="filter-${type}"
        class="trip-filters__filter-input
        visually-hidden"
        type="radio"
        name="trip-filter"
        value="${type}"
        ${type === currentFilterType ? `checked` : ``}
        ${count === 0 ? `disabled` : ``}
      />
      <label class="trip-filters__filter-label" for="filter-${type}">${name}</label>
    </div>`
  );
};

export const createTripFiltersTemplate = (filterItems, currentFilterType) => {

  const filterItemsTemplate = filterItems.map((filter) => createFilterItemTemplate(filter, currentFilterType)).join(``);

  return `<form class="trip-filters" action="#" method="get">
    ${filterItemsTemplate}
  </form>`;

  // return `<form class="trip-filters" action="#" method="get">
  //   <div class="trip-filters__filter">
  //     <input id="filter-everything" class="trip-filters__filter-input  visually-hidden" type="radio" name="trip-filter" value="everything" checked>
  //     <label class="trip-filters__filter-label" for="filter-everything">Everything</label>
  //   </div>

  //   <div class="trip-filters__filter">
  //     <input id="filter-future" class="trip-filters__filter-input  visually-hidden" type="radio" name="trip-filter" value="future">
  //     <label class="trip-filters__filter-label" for="filter-future">Future</label>
  //   </div>

  //   <div class="trip-filters__filter">
  //     <input id="filter-past" class="trip-filters__filter-input  visually-hidden" type="radio" name="trip-filter" value="past">
  //     <label class="trip-filters__filter-label" for="filter-past">Past</label>
  //   </div>

  //   <button class="visually-hidden" type="submit">Accept filter</button>
  // </form>`;
};

export default class TripFilters extends AbstractView {

  constructor(filters, currentFilterType) {
    super();

    this._filters = filters;
    this._currentFilter = currentFilterType;

    this._filterTypeChangeHandler = this._filterTypeChangeHandler.bind(this);
  }

  getTemplate() {
    return createTripFiltersTemplate(this._filters, this._currentFilter);
  }

  _filterTypeChangeHandler(evt) {
    evt.preventDefault();
    this._callback.filterTypeChange(evt.target.innerHTML);
  }

  setFilterTypeChangeHandler(callback) {
    this._callback.filterTypeChange = callback;
    this.getElement().addEventListener(`click`, this._filterTypeChangeHandler);
  }
}
