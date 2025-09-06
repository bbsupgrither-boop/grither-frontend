import { useState } from 'react';
import { Header } from './Header';
import { BottomNavigation } from './BottomNavigation';
import { Menu, X, Paperclip, Trophy } from './Icons';
import { Modal } from './Modal';
import { Achievement, SortType } from '../types/achievements';
import { mockAppState } from '../data/mockData';
import { EmptyCard } from './EmptyCard';
import { Panel } from './Panel';

interface AchievementsPageProps {
  onNavigate: (page: string) => void;
  currentPage: string;
  onOpenSettings?: () => void;
  achievements: Achievement[];
  setAchievements: React.Dispatch<React.SetStateAction<Achievement[]>>;
  profilePhoto?: string | null;
  theme?: 'light' | 'dark';
}

export function AchievementsPage({ onNavigate, currentPage, onOpenSettings, achievements, setAchievements, profilePhoto, theme = 'light' }: AchievementsPageProps) {
  const { currentUser } = mockAppState;
  const [sortMenuOpen, setSortMenuOpen] = useState(false);
  const [selectedAchievement, setSelectedAchievement] = useState<Achievement | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [sortType, setSortType] = useState<SortType>('progress_desc');
  const [fileUploadOpen, setFileUploadOpen] = useState(false);

  const handleSort = (type: SortType) => {
    setSortType(type);
    setSortMenuOpen(false);
  };

  const sortedAchievements = [...achievements].sort((a, b) => {
    switch (sortType) {
      case 'alphabet':
        return a.title.localeCompare(b.title);
      case 'progress_asc':
        const percentA = (a.requirements.current / a.requirements.target) * 100;
        const percentB = (b.requirements.current / b.requirements.target) * 100;
        return percentA - percentB;
      case 'progress_desc':
        const percentDescA = (a.requirements.current / a.requirements.target) * 100;
        const percentDescB = (b.requirements.current / b.requirements.target) * 100;
        // Сначала достижения с прогрессом, потом без прогресса
        if (percentDescA > 0 && percentDescB === 0) return -1;
        if (percentDescA === 0 && percentDescB > 0) return 1;
        return percentDescB - percentDescA;

      default:
        return 0;
    }
  });

  const handleAchievementClick = (achievement: Achievement) => {
    setSelectedAchievement(achievement);
    setIsDetailOpen(true);
  };

  const handleFileSelected = () => {
    if (selectedAchievement) {
      setAchievements(prevAchievements =>
        prevAchievements.map(achievement =>
          achievement.id === selectedAchievement.id
            ? { ...achievement, userFile: 'user_file.pdf' }
            : achievement
        )
      );
      
      setSelectedAchievement(prev => 
        prev ? { ...prev, userFile: 'user_file.pdf' } : null
      );
    }
    setFileUploadOpen(false);
  };

  const getProgressPercentage = (current: number, target: number) => {
    return Math.round((current / target) * 100);
  };

  return (
    <>
      <div 
        className="min-h-screen"
        style={{
          background: 'linear-gradient(135deg, #F5F7FA 0%, #FFFFFF 100%)',
          color: '#0F172A'
        }}
      >
        {/* Header */}
        <Header onNavigate={onNavigate} currentPage={currentPage} onOpenSettings={onOpenSettings} user={currentUser} profilePhoto={profilePhoto} />
        
        {/* Main Content */}
        <div className="max-w-md mx-auto pt-20 px-4 pb-32">
          <Panel
            title="Доступные достижения"
            rightButton={
              <button
                onClick={() => setSortMenuOpen(true)}
                className="apple-button transition-all hover:scale-105"
                style={{
                  width: '40px',
                  height: '40px',
                  minWidth: '44px',
                  minHeight: '44px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                <Menu style={{ width: '24px', height: '24px', color: '#6B7280' }} />
              </button>
            }
          >
            {sortedAchievements.length > 0 ? (
              <div className="space-y-3">
                {sortedAchievements.map((achievement) => (
                  <div
                    key={achievement.id}
                    onClick={() => handleAchievementClick(achievement)}
                    className={`surface-card transition-all hover:scale-[0.98] cursor-pointer flex items-center gap-4 ${
                      achievement.requirements.current === 0 
                        ? 'opacity-50 grayscale' 
                        : ''
                    }`}
                    style={{
                      backgroundColor: '#FFFFFF',
                      borderRadius: '16px',
                      padding: '16px',
                      border: '1px solid #E6E9EF',
                      boxShadow: '0 8px 24px rgba(0, 0, 0, 0.10)'
                    }}
                  >
                    <div 
                      className="flex items-center justify-center w-10 h-10 rounded-xl"
                      style={{ backgroundColor: 'rgba(43, 130, 255, 0.10)' }}
                    >
                      <Trophy style={{ width: '20px', height: '20px', color: '#2B82FF' }} />
                    </div>
                    
                    <div className="flex-1">
                      <div 
                        className="font-medium text-sm mb-1"
                        style={{ color: '#0F172A' }}
                      >
                        {achievement.title}
                      </div>
                      <div 
                        className="text-xs mb-2"
                        style={{ color: '#6B7280' }}
                      >
                        {achievement.description}
                      </div>
                    </div>
                    
                    <div className="text-right">
                      <div 
                        className="text-sm font-medium"
                        style={{ color: '#0F172A' }}
                      >
                        {getProgressPercentage(achievement.requirements.current, achievement.requirements.target)}%
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <EmptyCard variant="achievements_empty" />
            )}
          </Panel>
        </div>
        
        {/* Bottom Navigation */}
        <BottomNavigation onNavigate={onNavigate} currentPage={currentPage} />
      </div>

      {/* Меню сортировки */}
      <Modal
        isOpen={sortMenuOpen}
        onClose={() => setSortMenuOpen(false)}
        title="Сортировка"
        theme={theme}
      >
        <div className="space-y-3">
          <button
            onClick={() => handleSort('alphabet')}
            className="w-full transition-all hover:scale-[0.98] text-center"
            style={{
              padding: '12px 16px',
              borderRadius: '12px',
              backgroundColor: sortType === 'alphabet' 
                ? theme === 'dark' ? 'rgba(43, 130, 255, 0.12)' : 'rgba(43, 130, 255, 0.10)'
                : theme === 'dark' ? '#1C2029' : '#F3F5F8',
              border: sortType === 'alphabet' 
                ? '1px solid rgba(43, 130, 255, 0.20)'
                : theme === 'dark' ? '1px solid rgba(255, 255, 255, 0.06)' : '1px solid #E6E9EF',
              color: sortType === 'alphabet' 
                ? '#2B82FF' 
                : theme === 'dark' ? '#E8ECF2' : '#0F172A',
              fontSize: '14px'
            }}
          >
            По алфавиту
          </button>
          <button
            onClick={() => handleSort('progress_asc')}
            className="w-full transition-all hover:scale-[0.98] text-center"
            style={{
              padding: '12px 16px',
              borderRadius: '12px',
              backgroundColor: sortType === 'progress_asc' 
                ? theme === 'dark' ? 'rgba(43, 130, 255, 0.12)' : 'rgba(43, 130, 255, 0.10)'
                : theme === 'dark' ? '#1C2029' : '#F3F5F8',
              border: sortType === 'progress_asc' 
                ? '1px solid rgba(43, 130, 255, 0.20)'
                : theme === 'dark' ? '1px solid rgba(255, 255, 255, 0.06)' : '1px solid #E6E9EF',
              color: sortType === 'progress_asc' 
                ? '#2B82FF' 
                : theme === 'dark' ? '#E8ECF2' : '#0F172A',
              fontSize: '14px'
            }}
          >
            По проценту (от наименьшего)
          </button>
          <button
            onClick={() => handleSort('progress_desc')}
            className="w-full transition-all hover:scale-[0.98] text-center"
            style={{
              padding: '12px 16px',
              borderRadius: '12px',
              backgroundColor: sortType === 'progress_desc' 
                ? theme === 'dark' ? 'rgba(43, 130, 255, 0.12)' : 'rgba(43, 130, 255, 0.10)'
                : theme === 'dark' ? '#1C2029' : '#F3F5F8',
              border: sortType === 'progress_desc' 
                ? '1px solid rgba(43, 130, 255, 0.20)'
                : theme === 'dark' ? '1px solid rgba(255, 255, 255, 0.06)' : '1px solid #E6E9EF',
              color: sortType === 'progress_desc' 
                ? '#2B82FF' 
                : theme === 'dark' ? '#E8ECF2' : '#0F172A',
              fontSize: '14px'
            }}
          >
            По проценту (от наибольшего)
          </button>
        </div>
      </Modal>

      {/* Детали достижения */}
      <Dialog open={isDetailOpen} onOpenChange={setIsDetailOpen}>
        <DialogContent 
          className="glass-card rounded-3xl border-2 border-border apple-shadow w-[calc(100vw-16px)] max-w-md p-0 max-h-[85vh] flex flex-col [&>button]:hidden"
          aria-describedby="achievement-detail-description"
        >
          <div className="p-4 sm:p-6 flex-1 flex flex-col">
            {/* Заголовок */}
            <div className="flex items-center justify-between mb-4 sm:mb-6">
              <div className="w-6 sm:w-8"></div>
              
              <DialogTitle className="text-sm sm:text-lg font-medium text-foreground text-center flex-1 px-2">
                Условия выполнения достижения
              </DialogTitle>
              
              <button
                onClick={() => setIsDetailOpen(false)}
                className="p-1 sm:p-2 hover:bg-black/5 rounded-lg transition-colors flex-shrink-0"
              >
                <X className="w-3 h-3 sm:w-4 sm:h-4 text-foreground/70" />
              </button>
            </div>
            
            <DialogDescription id="achievement-detail-description" className="sr-only">
              Детальная информация о достижении
            </DialogDescription>

            {selectedAchievement && (
              <div className="flex-1 overflow-y-auto space-y-4">
                {/* Иконка и название */}
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-16 h-16 bg-muted/30 rounded-2xl flex items-center justify-center">
                    <Trophy className="w-8 h-8 text-muted-foreground" />
                  </div>
                  
                  <div className="flex-1">
                    <div className="text-sm font-medium text-foreground mb-1">
                      {selectedAchievement.title}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {selectedAchievement.description}
                    </div>
                  </div>
                </div>

                {/* Условия выполнения */}
                <div className="glass-card rounded-2xl p-4">
                  <div className="text-sm font-medium text-foreground mb-3">
                    Краткое описание достижения
                  </div>
                  <div className="space-y-2">
                    {selectedAchievement.conditions?.length ? (
                      selectedAchievement.conditions.map((condition, index) => (
                        <div key={index} className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <div className="w-1 h-1 bg-muted-foreground rounded-full"></div>
                            <span className="text-sm text-foreground">{condition}</span>
                          </div>
                          <button
                            onClick={() => setFileUploadOpen(true)}
                            className={`p-2 rounded-lg transition-colors ${
                              selectedAchievement.userFile
                                ? 'bg-muted text-muted-foreground'
                                : 'hover:bg-black/5 text-muted-foreground'
                            }`}
                          >
                            <Paperclip className="w-4 h-4" />
                          </button>
                        </div>
                      ))
                    ) : (
                      <div className="flex items-center gap-2">
                        <div className="w-1 h-1 bg-muted-foreground rounded-full"></div>
                        <span className="text-sm text-foreground">
                          {selectedAchievement.requirements.type}: {selectedAchievement.requirements.current}/{selectedAchievement.requirements.target}
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Комментарий от админа */}
                <div className={`glass-card rounded-2xl p-4 ${
                  !selectedAchievement.adminComment ? 'opacity-50' : ''
                }`}>
                  <div className="flex items-center justify-between mb-3">
                    <div className="text-sm font-medium text-foreground">
                      Комментарий от Админа
                    </div>
                    {selectedAchievement.adminFile && (
                      <button
                        className="p-2 rounded-lg hover:bg-black/5 transition-colors text-muted-foreground"
                      >
                        <Paperclip className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {selectedAchievement.adminComment || 'Комментарий не добавлен'}
                  </div>
                </div>

                {/* Кнопки */}
                <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 pt-3 sm:pt-4">
                  <button
                    onClick={() => setIsDetailOpen(false)}
                    className="w-full sm:flex-1 glass-card rounded-2xl p-2 sm:p-3 text-xs sm:text-sm font-medium text-foreground hover:scale-[0.98] transition-transform text-center"
                  >
                    Отменить
                  </button>
                  <button
                    className="w-full sm:flex-1 bg-primary text-primary-foreground rounded-2xl p-2 sm:p-3 text-xs sm:text-sm font-medium hover:scale-[0.98] transition-transform text-center"
                  >
                    Применить
                  </button>
                </div>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* Модальное окно загрузки файла */}
      <Dialog open={fileUploadOpen} onOpenChange={setFileUploadOpen}>
        <DialogContent 
          className="glass-card rounded-3xl border-2 border-border apple-shadow w-[calc(100vw-16px)] max-w-sm p-4 sm:p-6 [&>button]:hidden"
          aria-describedby="file-upload-description"
        >
          <DialogTitle className="text-lg font-medium text-foreground text-center mb-6">
            Прикрепить файл
          </DialogTitle>
          
          <DialogDescription id="file-upload-description" className="sr-only">
            Выберите файл для прикрепления к достижению
          </DialogDescription>

          <div className="space-y-4">
            <div className="glass-card rounded-2xl p-6 text-center">
              <div className="w-12 h-12 mx-auto mb-4 bg-primary/20 rounded-xl flex items-center justify-center">
                <Paperclip className="w-6 h-6 text-primary" />
              </div>
              <p className="text-sm text-muted-foreground mb-4">
                Выберите файл для загрузки
              </p>
              <input
                type="file"
                id="file-upload"
                className="hidden"
                onChange={handleFileSelected}
                accept="image/*,video/*,.pdf,.doc,.docx"
              />
              <label
                htmlFor="file-upload"
                className="w-full glass-card rounded-2xl p-3 text-sm font-medium text-foreground hover:scale-[0.98] transition-transform cursor-pointer inline-block"
              >
                Выбрать файл
              </label>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setFileUploadOpen(false)}
                className="flex-1 glass-card rounded-2xl p-3 text-sm font-medium text-foreground hover:scale-[0.98] transition-transform text-center"
              >
                Отменить
              </button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}