import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import Icon from '@/components/ui/icon';
import { useToast } from '@/hooks/use-toast';

type GameStage = 'welcome' | 'counting' | 'exercises' | 'results';

interface Achievement {
  id: string;
  completed: boolean;
  stars: number;
}

const Index = () => {
  const [stage, setStage] = useState<GameStage>('welcome');
  const [clickedItems, setClickedItems] = useState<number[]>([]);
  const [achievements, setAchievements] = useState<Achievement[]>([
    { id: 'counting', completed: false, stars: 0 },
    { id: 'exercises', completed: false, stars: 0 },
    { id: 'movements', completed: false, stars: 0 },
  ]);
  const [exerciseTimer, setExerciseTimer] = useState(5);
  const [isExercising, setIsExercising] = useState(false);
  const { toast } = useToast();

  const items = [
    { id: 1, emoji: '🍎', name: 'яблоко', image: 'https://cdn.poehali.dev/projects/1708530a-e410-4e23-958b-6bed7b5ca1e2/files/42ed008b-79a3-41b8-ac93-e9708c910846.jpg' },
    { id: 2, emoji: '⭐', name: 'звезда', image: 'https://cdn.poehali.dev/projects/1708530a-e410-4e23-958b-6bed7b5ca1e2/files/1bba3a44-a1c9-4405-8375-075b407bb6e2.jpg' },
    { id: 3, emoji: '🚗', name: 'машинка', image: 'https://cdn.poehali.dev/projects/1708530a-e410-4e23-958b-6bed7b5ca1e2/files/3ebe75c9-9eb8-4588-b016-acf06ed92b1e.jpg' },
    { id: 4, emoji: '🎈', name: 'шарик', image: null },
    { id: 5, emoji: '🎁', name: 'подарок', image: null },
  ];

  useEffect(() => {
    if (isExercising && exerciseTimer > 0) {
      const timer = setTimeout(() => setExerciseTimer(exerciseTimer - 1), 1000);
      return () => clearTimeout(timer);
    } else if (isExercising && exerciseTimer === 0) {
      setIsExercising(false);
      completeAchievement('movements');
      showConfetti();
      toast({
        title: "Отлично! 🎉",
        description: "Ты выполнил все движения!",
      });
    }
  }, [isExercising, exerciseTimer]);

  const handleItemClick = (id: number) => {
    if (!clickedItems.includes(id)) {
      const newClicked = [...clickedItems, id];
      setClickedItems(newClicked);
      
      if (newClicked.length === 5) {
        completeAchievement('counting');
        showConfetti();
        toast({
          title: "Молодец! 🌟",
          description: "Ты посчитал все предметы до 5!",
        });
      }
    }
  };

  const completeAchievement = (id: string) => {
    setAchievements(prev =>
      prev.map(ach =>
        ach.id === id ? { ...ach, completed: true, stars: 3 } : ach
      )
    );
  };

  const showConfetti = () => {
    const duration = 2000;
    const end = Date.now() + duration;

    const frame = () => {
      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    };
    frame();
  };

  const startExercise = () => {
    setIsExercising(true);
    setExerciseTimer(5);
  };

  const totalStars = achievements.reduce((sum, ach) => sum + ach.stars, 0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-100 via-blue-50 to-yellow-50 overflow-hidden">
      {stage === 'welcome' && (
        <div className="flex flex-col items-center justify-center min-h-screen p-4 animate-fade-in">
          <div className="text-center space-y-8 max-w-2xl">
            <div className="relative">
              <h1 className="text-9xl md:text-[12rem] font-bold text-primary animate-bounce-slow drop-shadow-2xl">
                5
              </h1>
              <div className="absolute -top-8 -right-8 text-6xl animate-wiggle">⭐</div>
              <div className="absolute -bottom-4 -left-8 text-6xl animate-float">🎈</div>
            </div>
            
            <div className="space-y-4">
              <h2 className="text-4xl md:text-5xl font-bold text-foreground">
                Привет! Давай изучим число 5!
              </h2>
              <p className="text-xl md:text-2xl text-muted-foreground">
                Тебя ждут веселые игры и задания
              </p>
            </div>

            <Button 
              size="lg" 
              className="text-2xl px-12 py-8 rounded-full shadow-2xl hover:scale-110 transition-transform bg-primary hover:bg-primary/90"
              onClick={() => setStage('counting')}
            >
              <Icon name="Play" size={32} className="mr-2" />
              Начать приключение!
            </Button>
          </div>
        </div>
      )}

      {stage === 'counting' && (
        <div className="min-h-screen p-4 md:p-8">
          <div className="max-w-6xl mx-auto space-y-8">
            <div className="flex items-center justify-between flex-wrap gap-4">
              <Button
                variant="ghost"
                size="lg"
                onClick={() => setStage('welcome')}
                className="text-xl"
              >
                <Icon name="ArrowLeft" size={24} className="mr-2" />
                Назад
              </Button>
              
              <div className="flex items-center gap-2 bg-white/80 backdrop-blur-sm rounded-full px-6 py-3 shadow-lg">
                <Icon name="Star" size={24} className="text-yellow-500" />
                <span className="text-2xl font-bold">{totalStars}</span>
              </div>
            </div>

            <Card className="p-8 bg-white/90 backdrop-blur-sm shadow-2xl">
              <div className="space-y-6">
                <div className="text-center space-y-2">
                  <h2 className="text-4xl font-bold text-foreground">
                    Посчитай до 5!
                  </h2>
                  <p className="text-xl text-muted-foreground">
                    Нажми на все предметы по порядку
                  </p>
                </div>

                <Progress value={(clickedItems.length / 5) * 100} className="h-4" />

                <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
                  {items.map((item, index) => {
                    const isClicked = clickedItems.includes(item.id);
                    const clickNumber = clickedItems.indexOf(item.id) + 1;
                    
                    return (
                      <div
                        key={item.id}
                        onClick={() => !isClicked && handleItemClick(item.id)}
                        className={`relative cursor-pointer transition-all duration-300 ${
                          isClicked ? 'scale-90 opacity-50' : 'hover:scale-110'
                        }`}
                      >
                        <Card className={`p-6 aspect-square flex flex-col items-center justify-center gap-4 ${
                          isClicked ? 'bg-green-100 border-green-400' : 'bg-white hover:shadow-xl'
                        }`}>
                          {item.image ? (
                            <img 
                              src={item.image} 
                              alt={item.name}
                              className="w-full h-24 object-contain"
                            />
                          ) : (
                            <span className="text-6xl">{item.emoji}</span>
                          )}
                          <p className="text-lg font-semibold text-center">{item.name}</p>
                          
                          {isClicked && (
                            <div className="absolute -top-3 -right-3 w-12 h-12 bg-green-500 text-white rounded-full flex items-center justify-center text-xl font-bold animate-scale-in shadow-lg">
                              {clickNumber}
                            </div>
                          )}
                        </Card>
                      </div>
                    );
                  })}
                </div>

                {clickedItems.length === 5 && (
                  <div className="text-center space-y-4 animate-fade-in pt-4">
                    <div className="text-6xl animate-bounce-slow">🎉</div>
                    <Button
                      size="lg"
                      onClick={() => setStage('exercises')}
                      className="text-xl px-8 py-6 rounded-full"
                    >
                      Дальше
                      <Icon name="ArrowRight" size={24} className="ml-2" />
                    </Button>
                  </div>
                )}
              </div>
            </Card>
          </div>
        </div>
      )}

      {stage === 'exercises' && (
        <div className="min-h-screen p-4 md:p-8">
          <div className="max-w-4xl mx-auto space-y-8">
            <div className="flex items-center justify-between flex-wrap gap-4">
              <Button
                variant="ghost"
                size="lg"
                onClick={() => setStage('counting')}
                className="text-xl"
              >
                <Icon name="ArrowLeft" size={24} className="mr-2" />
                Назад
              </Button>
              
              <div className="flex items-center gap-2 bg-white/80 backdrop-blur-sm rounded-full px-6 py-3 shadow-lg">
                <Icon name="Star" size={24} className="text-yellow-500" />
                <span className="text-2xl font-bold">{totalStars}</span>
              </div>
            </div>

            <Card className="p-8 md:p-12 bg-white/90 backdrop-blur-sm shadow-2xl">
              <div className="space-y-8 text-center">
                <h2 className="text-4xl md:text-5xl font-bold text-foreground">
                  Динамическая пауза! 🤸
                </h2>
                
                <p className="text-2xl text-muted-foreground">
                  Давай подвигаемся! Повторяй движения 5 раз
                </p>

                {!isExercising ? (
                  <div className="space-y-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <Card className="p-6 bg-purple-50 border-purple-200">
                        <div className="text-6xl mb-4">🙌</div>
                        <p className="text-xl font-semibold">Подними руки вверх</p>
                      </Card>
                      <Card className="p-6 bg-blue-50 border-blue-200">
                        <div className="text-6xl mb-4">👐</div>
                        <p className="text-xl font-semibold">Разведи руки в стороны</p>
                      </Card>
                      <Card className="p-6 bg-yellow-50 border-yellow-200">
                        <div className="text-6xl mb-4">🦵</div>
                        <p className="text-xl font-semibold">Подними колено</p>
                      </Card>
                      <Card className="p-6 bg-green-50 border-green-200">
                        <div className="text-6xl mb-4">🤸</div>
                        <p className="text-xl font-semibold">Прыгни на месте</p>
                      </Card>
                    </div>

                    <Button
                      size="lg"
                      onClick={startExercise}
                      className="text-2xl px-12 py-8 rounded-full"
                    >
                      <Icon name="Play" size={32} className="mr-2" />
                      Начать упражнение!
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-8">
                    <div className="relative">
                      <div className="text-[12rem] font-bold text-primary animate-pulse">
                        {exerciseTimer}
                      </div>
                      <p className="text-2xl text-muted-foreground mt-4">
                        Осталось повторений
                      </p>
                    </div>
                    <Progress value={((5 - exerciseTimer) / 5) * 100} className="h-6" />
                  </div>
                )}

                {!isExercising && exerciseTimer === 0 && (
                  <Button
                    size="lg"
                    onClick={() => setStage('results')}
                    className="text-xl px-8 py-6 rounded-full"
                  >
                    Посмотреть результаты
                    <Icon name="Trophy" size={24} className="ml-2" />
                  </Button>
                )}
              </div>
            </Card>
          </div>
        </div>
      )}

      {stage === 'results' && (
        <div className="min-h-screen p-4 md:p-8 flex items-center justify-center">
          <Card className="max-w-2xl w-full p-8 md:p-12 bg-white/90 backdrop-blur-sm shadow-2xl animate-scale-in">
            <div className="space-y-8 text-center">
              <div className="text-8xl animate-bounce-slow">🏆</div>
              
              <h2 className="text-4xl md:text-5xl font-bold text-foreground">
                Поздравляем!
              </h2>
              
              <p className="text-2xl text-muted-foreground">
                Ты выполнил все задания и заработал
              </p>

              <div className="flex items-center justify-center gap-2">
                {[...Array(totalStars)].map((_, i) => (
                  <Icon 
                    key={i} 
                    name="Star" 
                    size={48} 
                    className="text-yellow-500 fill-yellow-500 animate-bounce-slow"
                    style={{ animationDelay: `${i * 0.1}s` }}
                  />
                ))}
              </div>

              <div className="space-y-4 pt-4">
                {achievements.map((ach) => (
                  <Card 
                    key={ach.id} 
                    className={`p-6 ${ach.completed ? 'bg-green-50 border-green-300' : 'bg-gray-50'}`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xl font-semibold">
                        {ach.id === 'counting' && '📊 Счёт до 5'}
                        {ach.id === 'exercises' && '🎯 Игровые задания'}
                        {ach.id === 'movements' && '🤸 Динамическая пауза'}
                      </span>
                      <div className="flex gap-1">
                        {[...Array(ach.stars)].map((_, i) => (
                          <Icon 
                            key={i} 
                            name="Star" 
                            size={24} 
                            className="text-yellow-500 fill-yellow-500"
                          />
                        ))}
                      </div>
                    </div>
                  </Card>
                ))}
              </div>

              <Button
                size="lg"
                onClick={() => {
                  setStage('welcome');
                  setClickedItems([]);
                  setAchievements([
                    { id: 'counting', completed: false, stars: 0 },
                    { id: 'exercises', completed: false, stars: 0 },
                    { id: 'movements', completed: false, stars: 0 },
                  ]);
                  setExerciseTimer(5);
                }}
                className="text-xl px-8 py-6 rounded-full"
              >
                <Icon name="RotateCcw" size={24} className="mr-2" />
                Начать сначала
              </Button>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
};

export default Index;
