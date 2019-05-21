import React, { Component } from 'react'
import extend from 'lodash/extend'
import { SearchkitManager,SearchkitProvider,
  SearchBox, Pagination, Toggle,
  HitsStats, SortingSelector, NoHits,
  ResetFilters, RangeFilter,
  ViewSwitcherHits, ViewSwitcherToggle, DynamicRangeFilter,
  InputFilter, GroupedSelectedFilters,
  Layout, TopBar, LayoutBody, LayoutResults,
  ActionBar, ActionBarRow, SideBar } from 'searchkit'
import './index.css'

const host = "http://localhost:9200/yelp_dentists"
const searchkit = new SearchkitManager(host)

const MovieHitsGridItem = (props)=> {
  const {bemBlocks, result} = props
  const source = extend({}, result._source, result.highlight)
  return (
    <div className={bemBlocks.item().mix(bemBlocks.container("item"))} data-qa="hit" >
      <a href={'https://www.yelp.com/biz_photos/' + source.alias} target="_blank">
        <img data-qa="image" alt="presentation" className={bemBlocks.item("poster")} src={source.image_url.replace("o.jpg", "ls.jpg")} width="200px"/>
      </a>
      <a href={source.url.split('?')[0]} target="_blank">
        <div data-qa="name" className={bemBlocks.item("title")} dangerouslySetInnerHTML={{__html:source.name}}></div>
      </a>
    </div>
  )
}

const MovieHitsListItem = (props)=> {
  const {bemBlocks, result} = props
  const source = extend({}, result._source, result.highlight)
  return (
    <div className={bemBlocks.item().mix(bemBlocks.container("item"))} data-qa="hit" >
      <div className={bemBlocks.item("poster")}>
        <a href={'https://www.yelp.com/biz_photos/' + result._source.alias} target="_blank"><img alt="presentation" data-qa="poster" src={result._source.image_url.replace("o.jpg", "ls.jpg")}/></a>
      </div>
      <div className={bemBlocks.item("details")}>
        <a href={result._source.url.split('?')[0]} target="_blank"><h2 className={bemBlocks.item("name")} dangerouslySetInnerHTML={{__html:source.name}}></h2></a>
        <h3 className={bemBlocks.item("subtitle")}> {source.rating}/5 ({source.review_count} reviews)</h3>
        <div className={bemBlocks.item("text")} dangerouslySetInnerHTML={{__html:source.display_phone}}></div>
        <h3 className={bemBlocks.item("subtitle")}> {source.location.display_address.join(', ', " ")}</h3>
        <h3 className={bemBlocks.item("subtitle")}> {source.categories.flatMap(v => v['title']).join('|')}</h3>
      </div>
    </div>
  )
}

class App extends Component {
  render() {
    return (
      <SearchkitProvider searchkit={searchkit}>
        <Layout>
          <TopBar>
            <div className="my-logo">Laguro Spy</div>
            <SearchBox autofocus={true} searchOnChange={true} prefixQueryFields={["name^1"]}/>
          </TopBar>

        <LayoutBody>
          <SideBar>
            <Toggle fields={["location.city"]} title="Cities" id="cities"/>
            <RangeFilter min={0} max={5} field="rating" id="rating" title="Rating" showHistogram={true}/>
            <DynamicRangeFilter field="review_count" id="review_count" title="Reviews"/>
            <InputFilter id="address" searchThrottleTime={500} title="Filter by Address" placeholder="search by address" searchOnChange={true} queryFields={["location.display_address"]} />
          </SideBar>
          <LayoutResults>
            <ActionBar>
              <ActionBarRow>
                <HitsStats translations={{
                  "hitstats.results_found":"{hitCount} results found"
                }}/>
                <ViewSwitcherToggle/>
                <SortingSelector options={[
                  {label: "Popular", field:"review_count", order:"desc"},
                  {label:"Best", field:"rating", order:"desc"},
                  {label:"Worst", field:"rating", order:"asc"},
                  {label:"Relevance", field:"_score", order:"desc"},
                ]}/>
              </ActionBarRow>

              <ActionBarRow>
                <GroupedSelectedFilters/>
                <ResetFilters/>
              </ActionBarRow>

            </ActionBar>
            <ViewSwitcherHits
                hitsPerPage={20} highlightFields={["name"]}
                sourceFilter={["image_url", "name", "id", "rating", "location", "display_phone", "categories", "review_count", "url", "alias"]}
                hitComponents={[
                  {key:"grid", title:"Grid", itemComponent:MovieHitsGridItem, defaultOption:true},
                  {key:"list", title:"List", itemComponent:MovieHitsListItem}
                ]}
                scrollTo="body"
            />
            <NoHits suggestionsField={"name"}/>
            <Pagination showNumbers={true}/>
          </LayoutResults>

          </LayoutBody>
        </Layout>
      </SearchkitProvider>
    );
  }
}

export default App;
