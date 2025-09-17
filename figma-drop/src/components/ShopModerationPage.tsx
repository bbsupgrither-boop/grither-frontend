import { useState } from 'react';
import { ArrowLeft, X, Package, CheckCircle, XCircle } from './Icons';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from './ui/dialog';
import { Button } from './ui/button';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { Order } from '../types/shop';

interface ShopModerationPageProps {
  onBack: () => void;
  orders: Order[];
  setOrders: (orders: Order[]) => void;
  onUpdateUserBalance?: (userId: string, amount: number) => void;
}

interface OrderDetailsModalProps {
  order: Order | null;
  isOpen: boolean;
  onClose: () => void;
  onApprove: (orderId: string, trackingInfo: string) => void;
  onReject: (orderId: string, reason: string) => void;
}

function OrderDetailsModal({ order, isOpen, onClose, onApprove, onReject }: OrderDetailsModalProps) {
  const [showApprovalForm, setShowApprovalForm] = useState(false);
  const [showRejectionForm, setShowRejectionForm] = useState(false);
  const [trackingInfo, setTrackingInfo] = useState('');
  const [rejectionReason, setRejectionReason] = useState('');

  const handleApprove = () => {
    if (!trackingInfo.trim()) {
      alert('Необходимо заполнить информацию для отслеживания');
      return;
    }
    onApprove(order!.id, trackingInfo);
    onClose();
    setTrackingInfo('');
    setShowApprovalForm(false);
  };

  const handleReject = () => {
    if (!rejectionReason.trim()) {
      alert('Необходимо указать причину отклонения');
      return;
    }
    onReject(order!.id, rejectionReason);
    onClose();
    setRejectionReason('');
    setShowRejectionForm(false);
  };

  if (!order) return null;

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="bg-background border-none max-w-sm p-0 [&>button]:hidden max-h-[90vh] overflow-hidden rounded-3xl">
        <div className="p-6">
          <DialogHeader>
            <DialogTitle className="text-lg font-medium text-foreground text-center mb-4">
              Товар
            </DialogTitle>
            <DialogDescription className="sr-only">
              Детали заказа товара для модерации
            </DialogDescription>
            <div className="flex items-center justify-between mb-4">
              <div className="flex-1"></div>
              <button
                onClick={onClose}
                className="p-2 hover:bg-black/5 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-foreground/70" />
              </button>
            </div>
          </DialogHeader>

          <div className="space-y-4">
            {/* Информация о заказе */}
            <div className="glass-card rounded-2xl p-4">
              <div className="text-sm font-medium text-foreground mb-3">
                Заказ #{order.id}
              </div>
              <div className="text-xs text-muted-foreground mb-2">
                Дата заказа: {new Date(order.createdAt).toLocaleDateString()}
              </div>
              <div className="text-xs text-muted-foreground">
                Общая стоимость: {order.total} коинов
              </div>
            </div>

            {/* Товары в заказе */}
            <div className="glass-card rounded-2xl p-4">
              <div className="text-sm font-medium text-foreground mb-3">Товары в заказе:</div>
              <div className="space-y-2">
                {order.items.map((item, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-lg">{item.emoji}</span>
                      <div>
                        <div className="text-sm font-medium text-foreground">{item.name}</div>
                        <div className="text-xs text-muted-foreground">
                          {item.price} коинов x {item.quantity}
                        </div>
                      </div>
                    </div>
                    <div className="text-sm font-medium text-foreground">
                      {item.price * item.quantity} коинов
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Информация о сотруднике */}
            <div className="glass-card rounded-2xl p-4">
              <div className="text-sm font-medium text-foreground mb-2">
                Сотрудник: {order.customerName || 'Неизвестен'}
              </div>
              <div className="text-xs text-muted-foreground">
                Команда: {order.customerTeam || 'Не указана'}
              </div>
            </div>

            {/* Формы одобрения/отклонения */}
            {showApprovalForm && (
              <div className="glass-card rounded-2xl p-4">
                <div className="text-sm font-medium text-foreground mb-3">
                  Информация для отслеживания *
                </div>
                <textarea
                  value={trackingInfo}
                  onChange={(e) => setTrackingInfo(e.target.value)}
                  placeholder="Введите трек-номер, ссылку на сертификат или другую информацию для отслеживания..."
                  className="w-full p-3 bg-input-background border border-border rounded-2xl text-sm resize-none"
                  rows={3}
                />
                <div className="flex gap-2 mt-3">
                  <Button
                    variant="outline"
                    onClick={() => setShowApprovalForm(false)}
                    className="flex-1"
                  >
                    Отменить
                  </Button>
                  <Button
                    onClick={handleApprove}
                    className="flex-1 bg-green-500 hover:bg-green-600 text-white"
                  >
                    Одобрить
                  </Button>
                </div>
              </div>
            )}

            {showRejectionForm && (
              <div className="glass-card rounded-2xl p-4">
                <div className="text-sm font-medium text-foreground mb-3">
                  Причина отклонения *
                </div>
                <textarea
                  value={rejectionReason}
                  onChange={(e) => setRejectionReason(e.target.value)}
                  placeholder="Укажите причину отклонения заказа..."
                  className="w-full p-3 bg-input-background border border-border rounded-2xl text-sm resize-none"
                  rows={3}
                />
                <div className="flex gap-2 mt-3">
                  <Button
                    variant="outline"
                    onClick={() => setShowRejectionForm(false)}
                    className="flex-1"
                  >
                    Отменить
                  </Button>
                  <Button
                    onClick={handleReject}
                    className="flex-1 bg-red-500 hover:bg-red-600 text-white"
                  >
                    Отклонить
                  </Button>
                </div>
              </div>
            )}

            {/* Кнопки действий */}
            {!showApprovalForm && !showRejectionForm && (
              <div className="flex gap-3">
                <Button
                  variant="outline"
                  onClick={() => setShowRejectionForm(true)}
                  className="flex-1 border-red-200 text-red-600 hover:bg-red-50"
                >
                  Отклонить
                </Button>
                <Button
                  onClick={() => setShowApprovalForm(true)}
                  className="flex-1 bg-primary text-primary-foreground"
                >
                  Одобрить
                </Button>
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export function ShopModerationPage({ onBack, orders, setOrders, onUpdateUserBalance }: ShopModerationPageProps) {
  // Заказы теперь управляются через глобальное состояние

  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [showOrderDetails, setShowOrderDetails] = useState(false);

  const handleOrderClick = (order: Order) => {
    setSelectedOrder(order);
    setShowOrderDetails(true);
  };

  const handleApproveOrder = (orderId: string, trackingInfo: string) => {
    setOrders(orders.map(order => 
      order.id === orderId 
        ? { ...order, status: 'active' as const, trackingInfo }
        : order
    ));
    console.log(`Заказ ${orderId} одобрен администратором с информацией для отслеживания: ${trackingInfo}`);
  };

  const handleRejectOrder = (orderId: string, reason: string) => {
    const rejectedOrder = orders.find(order => order.id === orderId);
    
    // Возвращаем деньги пользователю пр�� отклонении заказа
    if (rejectedOrder && onUpdateUserBalance) {
      onUpdateUserBalance(rejectedOrder.userId, rejectedOrder.total);
      console.log(`Возвращено ${rejectedOrder.total} коинов пользователю ${rejectedOrder.userId} за отклоненный заказ`);
    }
    
    setOrders(orders.map(order => 
      order.id === orderId 
        ? { ...order, status: 'rejected' as const, rejectionReason: reason }
        : order
    ));
    console.log(`Заказ ${orderId} отклонен администратором с причиной: ${reason}`);
  };

  const pendingOrdersList = orders.filter(order => order.status === 'pending');

  return (
    <div className="min-h-screen bg-background">
      {/* Заголовок страницы */}
      <div className="p-6">
        <div className="flex items-center gap-4 mb-6">
          <button
            onClick={onBack}
            className="p-2 hover:bg-black/5 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-foreground/70" />
          </button>
          <h1 className="text-lg font-medium text-foreground">Модерация товаров</h1>
        </div>
      </div>

      {/* Содержимое */}
      <div className="px-6 space-y-4 pb-20">
        {pendingOrdersList.length === 0 ? (
          <div className="glass-card rounded-2xl p-8 text-center">
            <Package className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <div className="text-foreground font-medium mb-2">Нет заказов на модерации</div>
            <div className="text-sm text-muted-foreground">
              Все заказы обработаны
            </div>
          </div>
        ) : (
          pendingOrdersList.map((order) => (
            <div 
              key={order.id}
              className="glass-card rounded-2xl p-4 cursor-pointer hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
              onClick={() => handleOrderClick(order)}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-secondary rounded-lg flex items-center justify-center overflow-hidden">
                    {order.items[0]?.emoji ? (
                      <span className="text-lg">{order.items[0].emoji}</span>
                    ) : (
                      <Package className="w-5 h-5 text-primary" />
                    )}
                  </div>
                  <div>
                    <div className="text-sm font-medium text-foreground">
                      Заказ #{order.id}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {order.items.length} товар(ов) • {order.total} коинов
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {order.customerName || 'Неизвестный пользователь'}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleRejectOrder(order.id, 'Отклонено администратором без указания причины');
                    }}
                    className="p-2 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <XCircle className="w-5 h-5 text-red-500" />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleApproveOrder(order.id, 'Одобрено администратором без дополнительной информации');
                    }}
                    className="p-2 hover:bg-green-50 rounded-lg transition-colors"
                  >
                    <CheckCircle className="w-5 h-5 text-green-500" />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Модальное окно деталей заказа */}
      <OrderDetailsModal
        order={selectedOrder}
        isOpen={showOrderDetails}
        onClose={() => {
          setShowOrderDetails(false);
          setSelectedOrder(null);
        }}
        onApprove={handleApproveOrder}
        onReject={handleRejectOrder}
      />
    </div>
  );
}