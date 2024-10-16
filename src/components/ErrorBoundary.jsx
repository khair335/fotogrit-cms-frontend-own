import { Component } from 'react';

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  componentDidCatch(error, errorInfo) {
    this.setState({ hasError: true });
    console.error(error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="w-full h-screen overflow-hidden relative flex justify-center items-center">
          <div className="bg__img-camera w-full h-full blur absolute top-0 left-0 z-0" />
          <div className="z-30 flex flex-col gap-4 items-center justify-center">
            <div className="bg-gray-100/20 rounded-md px-8">
              <img
                src="/images/animation-boat.gif"
                alt="boat"
                className="w-full h-full object-cover"
              />
            </div>
            <h1 className="text-white font-bold p-2 px-4 rounded-md bg-black/20">
              Oops! Something went wrong.
            </h1>
            <p className="text-gray-300 text-center ">
              This page is crurrently not available. <br />
              We're working on the problem, and appreciate your patience.
            </p>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
