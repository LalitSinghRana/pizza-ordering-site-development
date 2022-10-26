import { Tabs } from '../components/Tabs';
import Button from '../components/elements/Button';
import { useSelector } from 'react-redux';
import { cartProducts } from '../stores/cart/cartSlice';
import useTabSwitch from '../hooks/useTabSwitch';
import { ReactComponent as ArrowRightSvg } from '../assets/icons/arrow-right-long-svgrepo-com.svg';
import { AddressForm } from '../components/AddressForm';
import { ProductsSummary } from '../components/ProductsSummary';
import { StripeWrapper } from '../components/PaymentForm';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { decodeToken } from 'react-jwt';
import { USER_CART } from '../constants/constants';

const Cart = () => {
	const token = localStorage.getItem('token');
	const cart = useSelector(cartProducts);
	const tabs = ['Summary', 'Delivery', 'Payment'];
	const [currentTab, handleTabSwitch] = useTabSwitch(tabs, 'Summary');
	const navigate = useNavigate();

	const getCartData = async () => {
		const res = await fetch(USER_CART, {
			headers: {
				'x-access-token': token,
			},
		});

		const data = await res.json();
		console.log(data);
	};

	useEffect(() => {
		const myDecodedToken = decodeToken(token);

		if (!myDecodedToken) {
			localStorage.removeItem('token');
			navigate('/login');
		} else {
			// getCartData();
		}
	}, []);

	if (!cart || cart.length === 0) {
		return (
			<div className='bg-white h-full text-black flex justify-center p-4'>
				<h1>Your Cart is empty</h1>
			</div>
		);
	}

	return (
		<div className='bg-white h-screen text-black mx-auto mt-2 border border-gray-200 p-4 md:w-2/3 rounded-lg shadow-md sm:p-6 lg:p-8'>
			<Tabs list={tabs} onTabSwitch={handleTabSwitch} activeTab={currentTab} />
			<div className={`tabs ${currentTab !== 'Summary' ? 'hidden' : ''}`}>
				<ProductsSummary />
				<div className='flex justify-end p-2'>
					<Button
						variant='dark'
						className='flex items-center'
						onClick={() => handleTabSwitch('Delivery')}
					>
						<span className='mr-1'>Next</span>
						<ArrowRightSvg />
					</Button>
				</div>
			</div>
			<div className={`tabs ${currentTab !== 'Delivery' ? 'hidden' : ''}`}>
				<AddressForm onTabSwitch={handleTabSwitch} />
			</div>
			<div className={`tabs ${currentTab !== 'Payment' ? 'hidden' : ''}`}>
				<StripeWrapper />
			</div>
		</div>
	);
};

export default Cart;
