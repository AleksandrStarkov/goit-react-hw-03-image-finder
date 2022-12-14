import { Component } from 'react';
import { getArticles } from 'newApi/newApi';
import Button from './Button/Button';
import ImageGallery from './ImageGallery/ImageGallery';
import Loader from './Loader/Loader';
import Searchbar from './Searchbar/Searchbar';
import Modal from './Modal/Modal';
import s from 'components/App.module.css';
import { notFound } from '../Assets/Assets';

class App extends Component {
  state = {
    query: '',
    page: 1,
    searchData: [],
    dataLargeImage: {},
    isLoading: false,
    isModalOpen: false,
    isError: false,
    totalHits: 0,
  };

  getSnapshotBeforeUpdate(prevProps, prevState) {
    if (prevState.searchData !== this.state.searchData) {
      return document.body.clientHeight;
    }
    return null;
  }

  // componentDidMount() {
  //   // console.log(this.state.page);
  //   const { page, query } = this.state;
  //   this.setState({ isLoading: true });
  //   getArticles(page, query)
  //     .then(({ hits, totalHits }) =>
  //       this.setState({ searchData: hits, totalHits }),
  //     )
  //     .catch(err => {
  //       console.log(err);
  //     })
  //     .finally(
  //       () => this.setState({ isLoading: false }),
  //       console.log(this.state.query),
  //     );
  // }

  componentDidUpdate(prevProps, prevState, snapshot) {
    if (prevState.query !== this.state.query && this.state.query) {
      this.getData();
    }

    if (prevState.searchData !== this.state.searchData && this.state.page > 1) {
      this.scrollPage(snapshot);
    }
  }

  onSubmitNewSearch = newSearchQuery => {
    this.setState({
      query: newSearchQuery,
      page: 1,
      searchData: [],
      isError: false,
    });
  };

  getData = () => {
    const { page, query } = this.state;

    this.setState({ isLoading: true });
    getArticles(page, query)
      .then(data =>
        this.setState(prev => ({
          searchData: [...prev.searchData, ...data.hits],
          page: prev.page + 1,
          // query: data.query,
          totalHits: data.totalHits,
        })),
      )
      .catch(err => this.setState({ isError: true }))
      .finally(() => this.setState({ isLoading: false }));
  };

  onLoadMore = () => {
    // const { page } = this.state;
    // this.setState({ page: page + 1 });
    this.getData();
  };

  onHandleClickImage = data => {
    this.setState({ dataLargeImage: data });
    this.toogleModal();
  };

  toogleModal = () => {
    this.setState(({ isModalOpen }) => ({ isModalOpen: !isModalOpen }));
  };

  scrollPage = snapshot => {
    window.scrollTo({
      top: snapshot - 250,
      behavior: 'smooth',
    });
  };

  render() {
    const {
      searchData,
      isLoading,
      isError,
      isModalOpen,
      dataLargeImage,
      totalHits,
    } = this.state;

    return (
      <div className={s.App}>
        {/* {isLoading && <Loader />} */}
        <Searchbar onSubmit={this.onSubmitNewSearch} />
        <div className={s.spiner}>{isLoading && <Loader />}</div>
        <ImageGallery
          searchData={searchData}
          onHandleClickImage={this.onHandleClickImage}
        />
        {searchData.length > 0 && searchData.length < totalHits && (
          <Button onLoadMore={this.onLoadMore} />
        )}
        {/* {isLoading && <Loader />} */}
        {isError && notFound()}
        {isModalOpen && (
          <Modal
            dataLargeImage={dataLargeImage}
            toogleModal={this.toogleModal}
          />
        )}
        {/* {isLoading && <Loader />} */}
      </div>
    );
  }
}

export default App;
