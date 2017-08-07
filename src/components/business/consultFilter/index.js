import consultFilter from './filter.vue';
import consultFilterSingle from './filter-single.vue';
import consultFilterMulti from './filter-multi.vue';
import consultFilterrUnion from './filter-union.vue';

consultFilter.single = consultFilterSingle;
consultFilter.multi = consultFilterMulti;
consultFilter.union = consultFilterrUnion;

export default consultFilter;