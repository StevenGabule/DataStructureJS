// ============================================
// DATA STREAM PROCESSING SYSTEM
// ============================================

class StreamProcessor {
	constructor() {
		this.pipeline = null;
		this.metrics = {
			processed: 0,
			filtered: 0,
			errors: 0
		};
	}

	// Build complex data pipeline
	static createPipeline(config) {
		const pipeline = [];

		// Add filtering stage
		if (config.filters) {
			pipeline.push(
				Transducers.filter(item => {
					for (const filter of config.filters) {
						if (!filter(item)) return false;
					}
					return true;
				})
			);
		}

		// Add transformation stage
		if (config.transformers) {
			for (const transformer of config.transformers) {
				pipeline.push(Transducers.map(transformer));
			}
		}

		// Add deduplication if needed
		if (config.deduplicate) {
			pipeline.push(Transducers.dedupe());
		}

		// Add windowing for aggregation
		if (config.windowSize) {
			pipeline.push(Transducers.window(config.windowSize));
		}

		// Add partitioning
		if (config.partitionBy) {
			pipeline.push(Transducers.partitionBy(config.partitionBy));
		}

		return comp(...pipeline);
	}

	process(data, config) {
		const pipeline = StreamProcessor.createPipeline(config);

		// Custom reducer for different output formats
		const outputReducer = config.outputFormat === 'map'
			? (map, item) => {
				map.set(item.id || Date.now(), item);
				return map;
			}
			: (arr, item) => {
				arr.push(item);
				return arr;
			};

		const initialValue = config.outputFormat === 'map'
			? new Map()
			: [];

		return transduce(pipeline, outputReducer, initialValue, data);
	}
}

// Real-world example: Log processing
const LogProcessor = {
	// Parse log line
	parseLine: (line) => {
		const match = line.match(/\[(\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2})\] \[(\w+)\] (.+)/);
		if (!match) return null;

		return {
			timestamp: new Date(match[1]),
			level: match[2],
			message: match[3]
		};
	},

	// Enrich log entry
	enrich: (entry) => ({
		...entry,
		processed: Date.now(),
		hash: btoa(entry.message).substring(0, 10)
	}),

	// Process logs with transducers
	processLogs: (logLines) => {
		const pipeline = comp(
			// Parse lines
			Transducers.map(LogProcessor.parseLine),
			// Filter out nulls
			Transducers.filter(entry => entry !== null),
			// Filter by log level
			Transducers.filter(entry =>
				['ERROR', 'WARN', 'INFO'].includes(entry.level)
			),
			// Enrich entries
			Transducers.map(LogProcessor.enrich),
			// Group by level
			Transducers.partitionBy(entry => entry.level),
			// Take only recent entries
			Transducers.map(group =>
				group.slice(-100) // Keep last 100 of each level
			)
		);

		return transduce(
			pipeline,
			(result, batch) => [...result, ...batch],
			[],
			logLines
		);
	}
};

// ============================================
// REAL-TIME ANALYTICS WITH TRANSDUCERS
// ============================================

class RealTimeAnalytics {
	constructor() {
		this.eventBuffer = [];
		this.aggregates = new Map();
	}

	// Create analytics pipeline
	static createAnalyticsPipeline(config) {
		return comp(
			// Filter events by type
			Transducers.filter(event =>
				!config.eventTypes || config.eventTypes.includes(event.type)
			),

			// Enrich with session data
			Transducers.map(event => ({
				...event,
				sessionId: event.sessionId || 'anonymous',
				timestamp: event.timestamp || Date.now(),
				userAgent: event.userAgent || 'unknown'
			})),

			// Window for time-based aggregation
			Transducers.window(config.windowSize || 10),

			// Calculate metrics for each window
			Transducers.map(window => ({
				windowStart: window[0].timestamp,
				windowEnd: window[window.length - 1].timestamp,
				eventCount: window.length,
				uniqueUsers: new Set(window.map(e => e.userId)).size,
				eventTypes: window.reduce((acc, e) => {
					acc[e.type] = (acc[e.type] || 0) + 1;
					return acc;
				}, {}),
				avgDuration: window.reduce((sum, e) =>
					sum + (e.duration || 0), 0
				) / window.length
			})),

			// Filter windows with significant activity
			Transducers.filter(metrics =>
				metrics.eventCount >= (config.minEvents || 5)
			),

			// Scan to maintain running totals
			Transducers.scan((acc, metrics) => ({
				totalEvents: acc.totalEvents + metrics.eventCount,
				totalWindows: acc.totalWindows + 1,
				avgEventsPerWindow: (acc.totalEvents + metrics.eventCount) /
					(acc.totalWindows + 1),
				peakEventCount: Math.max(acc.peakEventCount, metrics.eventCount),
				lastUpdate: Date.now()
			}), {
				totalEvents: 0,
				totalWindows: 0,
				avgEventsPerWindow: 0,
				peakEventCount: 0,
				lastUpdate: Date.now()
			})
		);
	}

	processEvents(events) {
		const pipeline = RealTimeAnalytics.createAnalyticsPipeline({
			eventTypes: ['click', 'scroll', 'pageview'],
			windowSize: 20,
			minEvents: 3
		});

		return transduce(
			pipeline,
			(results, metric) => {
				results.push(metric);
				return results;
			},
			[],
			events
		);
	}
}

// ============================================
// ETL PIPELINE WITH TRANSDUCERS
// ============================================

class ETLPipeline {
	static extract(source) {
		// Simulate data extraction
		return source.getData();
	}

	static createTransformPipeline(transformConfig) {
		const transforms = [];

		// Data validation
		transforms.push(
			Transducers.filter(record => {
				for (const field of transformConfig.requiredFields) {
					if (!record[field]) return false;
				}
				return true;
			})
		);

		// Data normalization
		transforms.push(
			Transducers.map(record => {
				const normalized = { ...record };

				// Normalize dates
				if (transformConfig.dateFields) {
					for (const field of transformConfig.dateFields) {
						if (normalized[field]) {
							normalized[field] = new Date(normalized[field]).toISOString();
						}
					}
				}

				// Normalize numbers
				if (transformConfig.numberFields) {
					for (const field of transformConfig.numberFields) {
						if (normalized[field]) {
							normalized[field] = parseFloat(normalized[field]);
						}
					}
				}

				return normalized;
			})
		);

		// Data enrichment
		if (transformConfig.enrichments) {
			for (const enrichment of transformConfig.enrichments) {
				transforms.push(Transducers.map(enrichment));
			}
		}

		// Data aggregation
		if (transformConfig.groupBy) {
			transforms.push(
				Transducers.groupBy(transformConfig.groupBy)
			);
		}

		return comp(...transforms);
	}

	static load(data, destination) {
		// Simulate data loading
		return destination.save(data);
	}

	static async run(source, destination, config) {
		// Extract
		const rawData = await ETLPipeline.extract(source);

		// Transform
		const pipeline = ETLPipeline.createTransformPipeline(config);
		const transformedData = transduce(
			pipeline,
			(result, item) => {
				result.push(item);
				return result;
			},
			[],
			rawData
		);

		// Load
		await ETLPipeline.load(transformedData, destination);

		return {
			processed: rawData.length,
			transformed: transformedData.length,
			success: true
		};
	}
}

// Example usage
const etlConfig = {
	requiredFields: ['id', 'timestamp', 'value'],
	dateFields: ['timestamp', 'createdAt', 'updatedAt'],
	numberFields: ['value', 'amount', 'quantity'],
	enrichments: [
		record => ({
			...record,
			processedAt: new Date().toISOString(),
			version: '1.0'
		}),
		record => ({
			...record,
			category: record.value > 100 ? 'high' : 'low'
		})
	],
	groupBy: record => record.category
};