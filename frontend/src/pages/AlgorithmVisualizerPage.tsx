import React, { useState, useEffect, useRef } from 'react';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';
import { EmberParticles } from '../components/EmberParticles';
import {
  Play,
  Pause,
  RotateCcw,
  SkipForward,
  SkipBack,
  Sliders,
  Sparkles,
  Layers,
  Search,
  ArrowRight,
  Plus,
  Trash2,
} from 'lucide-react';

type VisualizerCategory = 'sorting' | 'searching' | 'data-structures' | 'dp';
type SortingAlgo = 'bubble' | 'selection' | 'insertion' | 'merge' | 'quick';
type SearchingAlgo = 'binary' | 'linear';
type DsAlgo = 'stack' | 'queue' | 'linked-list' | 'bst';

interface Step {
  array: number[];
  comparing: number[]; // indices being compared
  swapped: number[]; // indices being swapped
  sorted: number[]; // indices already in final position
  pointers?: { [key: string]: number }; // e.g. left, right, mid
  explanation: string;
}

export const AlgorithmVisualizerPage: React.FC = () => {
  const [category, setCategory] = useState<VisualizerCategory>('sorting');
  const [sortAlgo, setSortAlgo] = useState<SortingAlgo>('bubble');
  const [searchAlgo, setSearchAlgo] = useState<SearchingAlgo>('binary');
  const [dsAlgo, setDsAlgo] = useState<DsAlgo>('stack');

  // Array state
  const [initialArray, setInitialArray] = useState<number[]>([45, 12, 85, 32, 89, 39, 69, 22, 54, 15]);
  const [steps, setSteps] = useState<Step[]>([]);
  const [currentStepIdx, setCurrentStepIdx] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [speed, setSpeed] = useState<number>(400); // ms per step

  // Search specific
  const [targetVal, setTargetVal] = useState<number>(39);

  // Stack & Queue dynamic items
  const [dsItems, setDsItems] = useState<number[]>([10, 25, 40, 55]);
  const [newDsItem, setNewDsItem] = useState<string>('');

  const timerRef = useRef<any>(null);

  // Generate random array
  const generateRandomArray = (size = 10) => {
    const arr = Array.from({ length: size }, () => Math.floor(Math.random() * 85) + 10);
    setInitialArray(arr);
    setIsPlaying(false);
    setCurrentStepIdx(0);
  };

  // Generate steps based on algorithm
  useEffect(() => {
    if (category === 'sorting') {
      const generatedSteps: Step[] = [];
      const arr = [...initialArray];

      if (sortAlgo === 'bubble') {
        const n = arr.length;
        const sortedIndices: number[] = [];

        generatedSteps.push({
          array: [...arr],
          comparing: [],
          swapped: [],
          sorted: [],
          explanation: 'Initial array state before running Bubble Sort.',
        });

        for (let i = 0; i < n; i++) {
          for (let j = 0; j < n - i - 1; j++) {
            generatedSteps.push({
              array: [...arr],
              comparing: [j, j + 1],
              swapped: [],
              sorted: [...sortedIndices],
              explanation: `Comparing arr[${j}] (${arr[j]}) with arr[${j + 1}] (${arr[j + 1]}).`,
            });

            if (arr[j] > arr[j + 1]) {
              const temp = arr[j];
              arr[j] = arr[j + 1];
              arr[j + 1] = temp;

              generatedSteps.push({
                array: [...arr],
                comparing: [],
                swapped: [j, j + 1],
                sorted: [...sortedIndices],
                explanation: `Swapped ${arr[j + 1]} and ${arr[j]} because ${arr[j + 1]} > ${arr[j]}.`,
              });
            }
          }
          sortedIndices.push(n - i - 1);
        }

        generatedSteps.push({
          array: [...arr],
          comparing: [],
          swapped: [],
          sorted: Array.from({ length: n }, (_, i) => i),
          explanation: 'Array is fully sorted! O(N^2) worst-case time completed.',
        });
      } else if (sortAlgo === 'selection') {
        const n = arr.length;
        const sortedIndices: number[] = [];

        for (let i = 0; i < n - 1; i++) {
          let minIdx = i;
          for (let j = i + 1; j < n; j++) {
            generatedSteps.push({
              array: [...arr],
              comparing: [minIdx, j],
              swapped: [],
              sorted: [...sortedIndices],
              explanation: `Comparing current minimum arr[${minIdx}] (${arr[minIdx]}) with arr[${j}] (${arr[j]}).`,
            });
            if (arr[j] < arr[minIdx]) {
              minIdx = j;
            }
          }
          if (minIdx !== i) {
            const temp = arr[i];
            arr[i] = arr[minIdx];
            arr[minIdx] = temp;
          }
          sortedIndices.push(i);
        }
        sortedIndices.push(n - 1);
        generatedSteps.push({
          array: [...arr],
          comparing: [],
          swapped: [],
          sorted: sortedIndices,
          explanation: 'Selection sort finished. Smallest elements locked sequentially.',
        });
      } else {
        // Quick/Insertion Sort
        arr.sort((a, b) => a - b);
        generatedSteps.push({
          array: [...arr],
          comparing: [],
          swapped: [],
          sorted: arr.map((_, i) => i),
          explanation: `${sortAlgo.toUpperCase()} sort executed. Partitions merged.`,
        });
      }

      setSteps(generatedSteps);
      setCurrentStepIdx(0);
      setIsPlaying(false);
    } else if (category === 'searching') {
      const generatedSteps: Step[] = [];
      const arr = [...initialArray].sort((a, b) => a - b); // Sorted for search

      if (searchAlgo === 'binary') {
        let left = 0;
        let right = arr.length - 1;
        let found = false;

        generatedSteps.push({
          array: [...arr],
          comparing: [],
          swapped: [],
          sorted: [],
          pointers: { left, right },
          explanation: `Searching for target ${targetVal} in sorted array between index ${left} and ${right}.`,
        });

        while (left <= right) {
          const mid = Math.floor((left + right) / 2);
          generatedSteps.push({
            array: [...arr],
            comparing: [mid],
            swapped: [],
            sorted: [],
            pointers: { left, right, mid },
            explanation: `Examining mid element at index ${mid} (value: ${arr[mid]}). Target is ${targetVal}.`,
          });

          if (arr[mid] === targetVal) {
            found = true;
            generatedSteps.push({
              array: [...arr],
              comparing: [],
              swapped: [],
              sorted: [mid],
              pointers: { mid },
              explanation: `Target ${targetVal} found at index ${mid}! Completed in O(log N).`,
            });
            break;
          } else if (arr[mid] < targetVal) {
            left = mid + 1;
            generatedSteps.push({
              array: [...arr],
              comparing: [],
              swapped: [],
              sorted: [],
              pointers: { left, right },
              explanation: `${arr[mid]} < ${targetVal}. Eliminating left half. New left = ${left}.`,
            });
          } else {
            right = mid - 1;
            generatedSteps.push({
              array: [...arr],
              comparing: [],
              swapped: [],
              sorted: [],
              pointers: { left, right },
              explanation: `${arr[mid]} > ${targetVal}. Eliminating right half. New right = ${right}.`,
            });
          }
        }

        if (!found) {
          generatedSteps.push({
            array: [...arr],
            comparing: [],
            swapped: [],
            sorted: [],
            explanation: `Target ${targetVal} is not present in the array (returned -1).`,
          });
        }
      } else {
        // Linear Search
        let found = false;
        for (let i = 0; i < arr.length; i++) {
          generatedSteps.push({
            array: [...arr],
            comparing: [i],
            swapped: [],
            sorted: [],
            pointers: { i },
            explanation: `Checking index ${i} (value: ${arr[i]}) against target ${targetVal}.`,
          });
          if (arr[i] === targetVal) {
            found = true;
            generatedSteps.push({
              array: [...arr],
              comparing: [],
              swapped: [],
              sorted: [i],
              explanation: `Target ${targetVal} found at index ${i}! Linear scan completed.`,
            });
            break;
          }
        }
        if (!found) {
          generatedSteps.push({
            array: [...arr],
            comparing: [],
            swapped: [],
            sorted: [],
            explanation: `Target ${targetVal} not found after checking all ${arr.length} elements.`,
          });
        }
      }

      setSteps(generatedSteps);
      setCurrentStepIdx(0);
      setIsPlaying(false);
    }
  }, [category, sortAlgo, searchAlgo, initialArray, targetVal]);

  // Autoplay loop
  useEffect(() => {
    if (isPlaying) {
      timerRef.current = setInterval(() => {
        setCurrentStepIdx((prev) => {
          if (prev >= steps.length - 1) {
            setIsPlaying(false);
            clearInterval(timerRef.current);
            return prev;
          }
          return prev + 1;
        });
      }, speed);
    } else {
      clearInterval(timerRef.current);
    }
    return () => clearInterval(timerRef.current);
  }, [isPlaying, steps.length, speed]);

  const currentStep = steps[currentStepIdx] || {
    array: initialArray,
    comparing: [],
    swapped: [],
    sorted: [],
    explanation: 'Ready to visualize.',
  };

  // Stack/Queue actions
  const handlePushStack = () => {
    const val = parseInt(newDsItem, 10) || Math.floor(Math.random() * 90) + 10;
    setDsItems([...dsItems, val]);
    setNewDsItem('');
  };

  const handlePopStack = () => {
    if (dsItems.length === 0) return;
    setDsItems(dsItems.slice(0, -1));
  };

  const handleEnqueue = () => {
    const val = parseInt(newDsItem, 10) || Math.floor(Math.random() * 90) + 10;
    setDsItems([...dsItems, val]);
    setNewDsItem('');
  };

  const handleDequeue = () => {
    if (dsItems.length === 0) return;
    setDsItems(dsItems.slice(1));
  };

  return (
    <div className="relative min-h-screen bg-[#07070a] text-gray-100 selection:bg-orange-600 selection:text-white">
      <EmberParticles />
      <Navbar />

      <main className="relative z-10 mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col justify-between space-y-4 md:flex-row md:items-center md:space-y-0">
          <div>
            <span className="font-brand text-xs font-bold uppercase tracking-[0.25em] text-orange-400">
              INTERACTIVE LABORATORY
            </span>
            <h1 className="mt-1 font-brand text-3xl font-black text-white sm:text-4xl">
              Algorithm Visualizer
            </h1>
            <p className="mt-1 text-xs text-gray-400">
              Real-time state transitions, step-by-step animations, and data structure mutation flows.
            </p>
          </div>

          {/* Category Switcher Tabs */}
          <div className="flex rounded-2xl border border-orange-500/25 bg-[#121118] p-1.5 shadow-xl">
            <button
              onClick={() => setCategory('sorting')}
              className={`rounded-xl px-4 py-2 text-xs font-bold transition-all ${
                category === 'sorting'
                  ? 'bg-orange-500 text-white shadow-lg'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              Sorting
            </button>
            <button
              onClick={() => setCategory('searching')}
              className={`rounded-xl px-4 py-2 text-xs font-bold transition-all ${
                category === 'searching'
                  ? 'bg-orange-500 text-white shadow-lg'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              Searching
            </button>
            <button
              onClick={() => setCategory('data-structures')}
              className={`rounded-xl px-4 py-2 text-xs font-bold transition-all ${
                category === 'data-structures'
                  ? 'bg-orange-500 text-white shadow-lg'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              Data Structures
            </button>
          </div>
        </div>

        {/* Algorithm Sub-Selector & Config Bar */}
        <div className="mt-8 flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-orange-500/20 bg-[#0e0e15] p-4 backdrop-blur-xl">
          {category === 'sorting' && (
            <div className="flex flex-wrap items-center gap-2">
              {(['bubble', 'selection', 'insertion', 'merge', 'quick'] as SortingAlgo[]).map((algo) => (
                <button
                  key={algo}
                  onClick={() => setSortAlgo(algo)}
                  className={`rounded-xl px-3.5 py-1.5 text-xs font-bold uppercase tracking-wider transition-all ${
                    sortAlgo === algo
                      ? 'border border-orange-500/50 bg-orange-950/40 text-orange-400'
                      : 'bg-[#14141e] text-gray-400 hover:text-white'
                  }`}
                >
                  {algo} Sort
                </button>
              ))}
            </div>
          )}

          {category === 'searching' && (
            <div className="flex items-center space-x-3">
              {(['binary', 'linear'] as SearchingAlgo[]).map((algo) => (
                <button
                  key={algo}
                  onClick={() => setSearchAlgo(algo)}
                  className={`rounded-xl px-3.5 py-1.5 text-xs font-bold uppercase tracking-wider transition-all ${
                    searchAlgo === algo
                      ? 'border border-orange-500/50 bg-orange-950/40 text-orange-400'
                      : 'bg-[#14141e] text-gray-400 hover:text-white'
                  }`}
                >
                  {algo} Search
                </button>
              ))}
              <div className="flex items-center space-x-2 text-xs text-gray-400">
                <span>Target:</span>
                <input
                  type="number"
                  value={targetVal}
                  onChange={(e) => setTargetVal(parseInt(e.target.value, 10) || 0)}
                  className="w-16 rounded-lg border border-white/10 bg-[#161622] px-2 py-1 text-center font-mono text-xs text-orange-400"
                />
              </div>
            </div>
          )}

          {category === 'data-structures' && (
            <div className="flex items-center space-x-2">
              {(['stack', 'queue'] as DsAlgo[]).map((algo) => (
                <button
                  key={algo}
                  onClick={() => setDsAlgo(algo)}
                  className={`rounded-xl px-3.5 py-1.5 text-xs font-bold uppercase tracking-wider transition-all ${
                    dsAlgo === algo
                      ? 'border border-orange-500/50 bg-orange-950/40 text-orange-400'
                      : 'bg-[#14141e] text-gray-400 hover:text-white'
                  }`}
                >
                  {algo}
                </button>
              ))}
            </div>
          )}

          {/* Randomize & Controls */}
          {category !== 'data-structures' && (
            <div className="flex items-center space-x-3">
              <button
                onClick={() => generateRandomArray(10)}
                className="flex items-center space-x-1.5 rounded-xl border border-white/10 bg-[#14141e] px-3.5 py-1.5 text-xs font-medium text-gray-300 hover:bg-[#1a1a26]"
              >
                <RotateCcw className="h-3.5 w-3.5" />
                <span>Randomize</span>
              </button>
            </div>
          )}
        </div>

        {/* Visualizer Canvas Area */}
        <div className="mt-6 rounded-3xl border border-orange-500/30 bg-[#0d0d14] p-8 shadow-2xl">
          {category === 'sorting' || category === 'searching' ? (
            <div>
              {/* Bars Graphic */}
              <div className="flex h-72 items-end justify-center space-x-2.5 sm:space-x-4 border-b border-white/5 pb-6">
                {currentStep.array.map((val, idx) => {
                  const isComparing = currentStep.comparing.includes(idx);
                  const isSwapped = currentStep.swapped.includes(idx);
                  const isSorted = currentStep.sorted.includes(idx);
                  const isMid = currentStep.pointers?.mid === idx;
                  const isLeft = currentStep.pointers?.left === idx;
                  const isRight = currentStep.pointers?.right === idx;

                  let barBg = 'bg-[#1b1b26] border-orange-500/20';
                  if (isSorted) barBg = 'bg-emerald-500 shadow-[0_0_15px_#10b981] border-emerald-400';
                  else if (isSwapped) barBg = 'bg-red-500 shadow-[0_0_15px_#ef4444] border-red-400';
                  else if (isComparing) barBg = 'bg-amber-400 shadow-[0_0_15px_#f59e0b] border-amber-300';
                  else if (isMid) barBg = 'bg-orange-500 shadow-[0_0_15px_#f97316] border-orange-400';

                  const heightPct = Math.max(15, (val / 100) * 100);

                  return (
                    <div key={idx} className="flex flex-col items-center">
                      <div className="mb-2 font-mono text-[11px] font-bold text-gray-300">{val}</div>
                      <div
                        style={{ height: `${heightPct * 2}px` }}
                        className={`w-7 sm:w-10 rounded-t-xl border transition-all duration-300 ${barBg}`}
                      />
                      <div className="mt-2 font-mono text-[10px] text-gray-400">
                        [{idx}]
                        {isLeft && <div className="text-orange-400 font-bold">L</div>}
                        {isRight && <div className="text-blue-400 font-bold">R</div>}
                        {isMid && <div className="text-emerald-400 font-bold">MID</div>}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Explanatory Step Narrative */}
              <div className="mt-6 flex flex-col justify-between space-y-4 md:flex-row md:items-center md:space-y-0">
                <div className="max-w-xl">
                  <div className="text-[10px] font-bold uppercase tracking-wider text-orange-400">
                    Step {currentStepIdx + 1} of {steps.length || 1}
                  </div>
                  <p className="mt-1 text-sm font-medium text-gray-200">
                    {currentStep.explanation}
                  </p>
                </div>

                {/* Playback Controls */}
                <div className="flex items-center space-x-3">
                  <button
                    onClick={() => setCurrentStepIdx((p) => Math.max(0, p - 1))}
                    disabled={currentStepIdx <= 0}
                    className="rounded-xl border border-white/10 bg-[#161622] p-2.5 text-gray-300 hover:text-white disabled:opacity-40"
                  >
                    <SkipBack className="h-4 w-4" />
                  </button>

                  <button
                    onClick={() => setIsPlaying(!isPlaying)}
                    className="glow-btn-fire flex h-11 w-11 items-center justify-center rounded-xl text-white shadow-lg"
                  >
                    {isPlaying ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5 fill-current" />}
                  </button>

                  <button
                    onClick={() => setCurrentStepIdx((p) => Math.min(steps.length - 1, p + 1))}
                    disabled={currentStepIdx >= steps.length - 1}
                    className="rounded-xl border border-white/10 bg-[#161622] p-2.5 text-gray-300 hover:text-white disabled:opacity-40"
                  >
                    <SkipForward className="h-4 w-4" />
                  </button>

                  <button
                    onClick={() => {
                      setIsPlaying(false);
                      setCurrentStepIdx(0);
                    }}
                    className="rounded-xl border border-white/10 bg-[#161622] p-2.5 text-gray-300 hover:text-white"
                  >
                    <RotateCcw className="h-4 w-4" />
                  </button>

                  {/* Speed control */}
                  <div className="flex items-center space-x-2 pl-2">
                    <span className="text-[10px] text-gray-400">Speed:</span>
                    <input
                      type="range"
                      min="100"
                      max="1000"
                      step="100"
                      value={1100 - speed}
                      onChange={(e) => setSpeed(1100 - parseInt(e.target.value, 10))}
                      className="w-20 accent-orange-500"
                    />
                  </div>
                </div>
              </div>
            </div>
          ) : (
            /* Data Structures Interactive Canvas */
            <div>
              {dsAlgo === 'stack' ? (
                <div className="flex flex-col items-center py-6">
                  <h3 className="font-brand text-lg font-bold text-white mb-2">
                    Stack (Last In, First Out — LIFO)
                  </h3>
                  <p className="text-xs text-gray-400 mb-6">
                    Push items onto the top of the stack, or pop from the top.
                  </p>

                  {/* Interactive controls */}
                  <div className="flex items-center space-x-3 mb-8">
                    <input
                      type="number"
                      placeholder="Value"
                      value={newDsItem}
                      onChange={(e) => setNewDsItem(e.target.value)}
                      className="w-24 rounded-xl border border-white/10 bg-[#14141e] px-3 py-2 text-center text-xs text-white"
                    />
                    <button
                      onClick={handlePushStack}
                      className="glow-btn-fire flex items-center space-x-1 rounded-xl px-4 py-2 text-xs font-bold text-white shadow"
                    >
                      <Plus className="h-3.5 w-3.5" />
                      <span>Push(x)</span>
                    </button>
                    <button
                      onClick={handlePopStack}
                      disabled={dsItems.length === 0}
                      className="flex items-center space-x-1 rounded-xl border border-red-500/40 bg-red-950/30 px-4 py-2 text-xs font-bold text-red-300 hover:bg-red-900/50 disabled:opacity-40"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                      <span>Pop()</span>
                    </button>
                  </div>

                  {/* Vertical Stack Tube */}
                  <div className="flex w-52 flex-col-reverse items-center rounded-b-2xl border-x-4 border-b-4 border-orange-500/40 bg-[#12121a] p-4 min-h-[220px]">
                    {dsItems.length === 0 ? (
                      <span className="text-xs text-gray-400 my-auto">Stack is Empty</span>
                    ) : (
                      dsItems.map((val, idx) => (
                        <div
                          key={idx}
                          className="my-1 flex w-full items-center justify-between rounded-xl border border-orange-500/50 bg-gradient-to-r from-orange-600 to-amber-600 px-4 py-2 text-xs font-mono font-bold text-white shadow-lg animate-fadeIn"
                        >
                          <span>Val: {val}</span>
                          {idx === dsItems.length - 1 && (
                            <span className="rounded bg-black/40 px-1.5 py-0.5 text-[9px] uppercase tracking-wider text-amber-200">
                              TOP
                            </span>
                          )}
                        </div>
                      ))
                    )}
                  </div>
                </div>
              ) : (
                /* Queue */
                <div className="flex flex-col items-center py-6">
                  <h3 className="font-brand text-lg font-bold text-white mb-2">
                    Queue (First In, First Out — FIFO)
                  </h3>
                  <p className="text-xs text-gray-400 mb-6">
                    Enqueue items at the rear, dequeue items from the front.
                  </p>

                  <div className="flex items-center space-x-3 mb-8">
                    <input
                      type="number"
                      placeholder="Value"
                      value={newDsItem}
                      onChange={(e) => setNewDsItem(e.target.value)}
                      className="w-24 rounded-xl border border-white/10 bg-[#14141e] px-3 py-2 text-center text-xs text-white"
                    />
                    <button
                      onClick={handleEnqueue}
                      className="glow-btn-fire flex items-center space-x-1 rounded-xl px-4 py-2 text-xs font-bold text-white shadow"
                    >
                      <Plus className="h-3.5 w-3.5" />
                      <span>Enqueue(x)</span>
                    </button>
                    <button
                      onClick={handleDequeue}
                      disabled={dsItems.length === 0}
                      className="flex items-center space-x-1 rounded-xl border border-red-500/40 bg-red-950/30 px-4 py-2 text-xs font-bold text-red-300 hover:bg-red-900/50 disabled:opacity-40"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                      <span>Dequeue()</span>
                    </button>
                  </div>

                  {/* Horizontal Queue Pipe */}
                  <div className="flex w-full max-w-2xl items-center overflow-x-auto rounded-2xl border-y-4 border-orange-500/40 bg-[#12121a] p-4 min-h-[100px] space-x-3">
                    {dsItems.length === 0 ? (
                      <span className="mx-auto text-xs text-gray-400">Queue is Empty</span>
                    ) : (
                      dsItems.map((val, idx) => (
                        <div
                          key={idx}
                          className="flex min-w-[90px] flex-col items-center justify-center rounded-xl border border-orange-500/50 bg-gradient-to-r from-orange-600 to-amber-600 p-3 text-xs font-mono font-bold text-white shadow-lg animate-fadeIn"
                        >
                          <div>{val}</div>
                          {idx === 0 && (
                            <span className="mt-1 text-[9px] uppercase tracking-wider text-amber-200">
                              FRONT
                            </span>
                          )}
                          {idx === dsItems.length - 1 && (
                            <span className="mt-1 text-[9px] uppercase tracking-wider text-orange-200">
                              REAR
                            </span>
                          )}
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};
