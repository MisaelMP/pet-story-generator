import { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';

interface Props {
	children: ReactNode;
}

interface State {
	hasError: boolean;
	error: Error | null;
	errorInfo: ErrorInfo | null;
}

export class ErrorBoundary extends Component<Props, State> {
	public state: State = {
		hasError: false,
		error: null,
		errorInfo: null,
	};

	public static getDerivedStateFromError(error: Error): State {
		return {
			hasError: true,
			error,
			errorInfo: null,
		};
	}

	public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
		console.error('ErrorBoundary caught an error:', error, errorInfo);
		this.setState({
			error,
			errorInfo,
		});
	}

	private handleReload = () => {
		window.location.reload();
	};

	private handleReset = () => {
		this.setState({
			hasError: false,
			error: null,
			errorInfo: null,
		});
	};

	public render() {
		if (this.state.hasError) {
			return (
				<div className='min-h-screen bg-gray-50 flex items-center justify-center p-4'>
					<div className='max-w-md w-full bg-white rounded-lg shadow-lg p-6 text-center'>
						<div className='w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4'>
							<AlertTriangle className='w-8 h-8 text-red-500' />
						</div>

						<h2 className='text-xl font-semibold text-gray-900 mb-2'>
							Something went wrong
						</h2>

						<p className='text-gray-600 mb-6'>
							We encountered an unexpected error. Please try refreshing the page
							or contact support if the problem persists.
						</p>

						<div className='flex gap-3 justify-center'>
							<button
								onClick={this.handleReset}
								className='px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors'
							>
								Try Again
							</button>

							<button
								onClick={this.handleReload}
								className='flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors'
							>
								<RefreshCw className='w-4 h-4' />
								Reload Page
							</button>
						</div>

						{import.meta.env.MODE === 'development' && this.state.error && (
							<details className='mt-6 text-left'>
								<summary className='cursor-pointer text-sm font-medium text-gray-700 mb-2'>
									Error Details (Development Only)
								</summary>
								<pre className='text-xs bg-gray-100 p-3 rounded overflow-auto text-red-600'>
									{this.state.error.toString()}
									{this.state.errorInfo?.componentStack}
								</pre>
							</details>
						)}
					</div>
				</div>
			);
		}

		return this.props.children;
	}
}
